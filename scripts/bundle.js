import { fileURLToPath } from "node:url";
import path from "path";
import chalk from "chalk";
import fs from "fs-extra";
import { build } from "esbuild";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");

const outputDir = path.join(projectRoot, "build");
fs.ensureDirSync(outputDir);

const buildConfig = {
  entryPoints: [path.join(projectRoot, "src/client.js")],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: path.join(outputDir, "bundle.js"),
  platform: "browser",
  target: ["es2022", "chrome120", "firefox120", "safari17", "edge120"],
  format: "iife",
  treeShaking: true,
  mangleProps: /^_/,
  legalComments: "none",
};

async function bundle() {
  try {
    await build(buildConfig);
    console.log(chalk.green("✓ Client JS bundled successfully"));
  } catch (error) {
    console.error(chalk.red("✗ Bundle failed:"), error);
    process.exit(1);
  }
}

bundle();
