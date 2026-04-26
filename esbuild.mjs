import * as esbuild from 'esbuild'
import * as fs from "node:fs";

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist', { recursive: true });
fs.cpSync('jpostcode-data/data/json', 'dist/jpostcode-data/data/json', {recursive: true});
fs.copyFileSync('jpostcode-data/LICENSE.txt', 'dist/jpostcode-data/LICENSE.txt');

const licenseBanner = `/*!
 * jpostcode-js
 * Copyright (c) 2026 Matzlika Co., Ltd.
 * Released under the MIT License.
 *
 * Includes postal code data from jpostcode-data
 * (https://github.com/kufu/jpostcode-data)
 * Copyright 2023 SmartHR, Inc.
 * Released under the MIT License.
 */`;

await esbuild.build({
  entryPoints: ["src/jpostcode.ts"],
  outfile: "dist/index.cjs.js",
  bundle: true,
  platform: "node",
  target: "esnext",
  minify: true,
  sourcemap: true,
  format: "cjs",
  banner: {
    js: licenseBanner
  }
}).catch((e) => {
  console.log(e);
  process.exit(1);
}).then(() => console.log("done cjs build"));

await esbuild.build({
  entryPoints: ["src/jpostcode.ts"],
  outfile: "dist/index.mjs",
  bundle: true,
  platform: "node",
  target: "esnext",
  minify: true,
  sourcemap: true,
  format: "esm",
  banner: {
    js: `${licenseBanner}\nimport path from "node:path"; import { fileURLToPath } from "node:url"; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);`
  }
}).catch((e) => {
  console.log(e);
  process.exit(1);
}).then(() => console.log("done esm build"));
