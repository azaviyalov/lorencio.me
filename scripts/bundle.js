import fs from "fs-extra";
import { build } from "esbuild";

import { log } from "./log.js";
import { bundlePath, clientPath, outputDir } from "./site.js";

try {
  await fs.ensureDir(outputDir);
  await build({
    entryPoints: [clientPath],
    outfile: bundlePath,
    bundle: true,
    format: "iife",
    legalComments: "none",
    minify: true,
    platform: "browser",
    target: ["es2022", "chrome120", "firefox120", "safari17", "edge120"],
    treeShaking: true,
  });

  log.success("Client bundle generated: build/bundle.js from src/client.js");
} catch (error) {
  log.error("Client bundle generation failed:", error);
  process.exit(1);
}
