import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const buildConfig = {
  entryPoints: [path.join(root, 'src/client.js')],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: path.join(root, 'docs/bundle.js'),
  platform: 'browser',
  target: ['es2022', 'chrome120', 'firefox120', 'safari17', 'edge120'],
  format: 'iife',
  treeShaking: true,
  mangleProps: /^_/,
  legalComments: 'none'
};

async function bundle() {
  try {
    await esbuild.build(buildConfig);
    console.log(chalk.green('✓ Client JS bundled successfully'));
  } catch (error) {
    console.error(chalk.red('✗ Bundle failed:'), error);
    process.exit(1);
  }
}

bundle();
