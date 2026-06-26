import path from "node:path";
import fg from "fast-glob";
import fs from "fs-extra";
import Handlebars from "handlebars";
import yaml from "js-yaml";
import * as sass from "sass";

import { formatPeriod, mergeTranslations, registerHelpers } from "./utils.js";

const LANGS = ["ru", "en"];

export const projectRoot = path.resolve(import.meta.dirname, "..");
export const outputDir = path.join(projectRoot, "build");

const resolve = (...parts) => path.join(projectRoot, ...parts);

export const indexPath = path.join(outputDir, "index.html");
export const bundlePath = path.join(outputDir, "bundle.js");
export const clientPath = resolve("src/client.js");

const read = (file) => fs.readFile(resolve(file), "utf8");

const write = (file, content) => fs.outputFile(resolve(file), content);

registerHelpers();

export const compileStyles = async ({ compressed = false } = {}) => {
  const css = sass.compile(path.join(projectRoot, "src/style.scss"), {
    style: compressed ? "compressed" : "expanded",
  }).css;

  await write("build/style.css", css);
};

export const copyAssets = () => fs.copy(resolve("assets"), outputDir);

export const emptyBuild = () => fs.emptyDir(outputDir);

export const renderSite = async (context = {}) => {
  await registerPartials();

  const [contentSource, layoutSource] = await Promise.all([
    read("data/content.yaml"),
    read("templates/layout.hbs"),
  ]);
  const content = yaml.load(contentSource);
  const layout = Handlebars.compile(layoutSource);

  return layout({
    views: LANGS.map((lang) => buildView(content, lang)),
    ...context,
  });
};

const registerPartials = async () => {
  Handlebars.unregisterPartial();

  const files = await fg("templates/partials/*.hbs", { cwd: projectRoot });
  const partials = await Promise.all(
    files.map(async (file) => [path.basename(file, ".hbs"), await read(file)])
  );

  partials.forEach(([name, source]) => Handlebars.registerPartial(name, source));
};

const buildView = (content, lang) => {
  const translations = content.i18n?.[lang] ?? content.i18n?.en ?? {};
  const labels = translations.labels ?? {};

  return {
    lang,
    name: translations.name,
    titleText: translations.title,
    documentTitle: formatTitle(translations.name, translations.title),
    headings: translations.headings ?? {},
    jobs: mergeItems(content.jobs, translations.jobs, labels),
    education: mergeItems(content.education, translations.education, labels),
    summary: translations.summary,
    skills: content.skills ?? [],
    additional: translations.additional ?? [],
    contacts: content.contacts ?? [],
    photo: {
      url: content.photo?.url,
      alt: content.photo?.alt ?? translations.name ?? "",
    },
    isDefault: lang === "ru",
  };
};

const mergeItems = (items, translations, periodLabels) =>
  mergeTranslations(items, translations, ["period"]).map((item) => ({
    ...item,
    period: formatPeriod(item.period, periodLabels),
  }));

const formatTitle = (...parts) => parts.filter(Boolean).join(" - ");
