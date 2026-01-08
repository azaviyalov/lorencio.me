import path from "path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import express from "express";
import fg from "fast-glob";
import fs from "fs-extra";
import Handlebars from "handlebars";
import yaml from "js-yaml";
import livereload from "livereload";

import { registerHelpers, computeAge, formatAge, mergeTranslations } from "./utils.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const PORT = process.env.PORT || 3000;
const LIVERELOAD_PORT = 35729;

registerHelpers();

const render = async () => {
  Handlebars.unregisterPartial();
  const partialFiles = fg.globSync(`${projectRoot}/templates/partials/*.hbs`);
  for (const file of partialFiles) {
    const name = path.basename(file, ".hbs");
    const content = fs.readFileSync(file, "utf8");
    Handlebars.registerPartial(name, content);
  }

  const content = yaml.load(fs.readFileSync(path.join(projectRoot, "data/content.yaml"), "utf8"));
  const layoutTemplate = Handlebars.compile(
    fs.readFileSync(path.join(projectRoot, "templates/layout.hbs"), "utf8")
  );

  const langs = ["ru", "en"];
  const views = langs.map((lang) => {
    const translations = content.i18n?.[lang] ?? content.i18n?.en ?? {};
    const age = content.birthdate ? computeAge(content.birthdate) : null;
    const ageText = age !== null ? formatAge(age, lang, translations.labels?.age, translations) : "";

    const headingTranslations = translations.headings ?? {};
    const buttonTranslations = translations.buttons ?? {};

    return {
      lang,
      name: translations.name,
      titleText: translations.title,
      ageText,
      headings: {
        education: headingTranslations.education,
        experience: headingTranslations.experience,
        petProjects: headingTranslations["pet-projects"],
        contacts: headingTranslations.contacts,
      },
      buttons: {
        showContacts: buttonTranslations["show-contacts"],
      },
      jobs: mergeTranslations(content.jobs ?? [], translations.jobs, "projects"),
      education: mergeTranslations(content.education ?? [], translations.education),
      petProjects: mergeTranslations(
        content["pet-projects"] ?? [],
        translations["pet-projects"]
      ),
      contacts: content.contacts,
      pageTitle: `${translations.name ?? ""} - ${translations.title ?? ""}`,
      isDefault: lang === "ru",
    };
  });

  const html = layoutTemplate({ views });

  return html.replace(
    "</body>",
    `<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':${LIVERELOAD_PORT}/livereload.js?snipver=1"></' + 'script>')</script></body>`
  );
};

const app = express();

app.use(express.static(path.join(projectRoot, "src")));
app.use(express.static(path.join(projectRoot, "assets")));

app.get("/", async (req, res, next) => {
  try {
    const html = await render();
    res.send(html);
  } catch (error) {
    next(error);
  }
});

app.use(express.static(path.join(projectRoot, "build")));

app.use((err, req, res, next) => {
  console.error(chalk.red("Error:"), err.message);
  res.status(500).send("Internal server error: " + err.message);
});

const lrServer = livereload.createServer({
  port: LIVERELOAD_PORT,
  exts: ["js", "yaml", "hbs", "css"],
});

lrServer.watch([
  path.join(projectRoot, "data"),
  path.join(projectRoot, "templates"),
  path.join(projectRoot, "src"),
  path.join(projectRoot, "assets"),
  path.join(projectRoot, "scripts"),
]);

app.listen(PORT, () => {
  console.log(chalk.green("✓ Development server"));
  console.log(chalk.cyan(`  http://localhost:${PORT}`));
  console.log(chalk.gray(`  LiveReload on port ${LIVERELOAD_PORT}`));
});
