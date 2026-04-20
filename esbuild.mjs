import * as esbuild from 'esbuild'
import * as fs from "node:fs";

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist', { recursive: true });
fs.cpSync('jpostcode-data/data/json', 'dist/jpostcode-data/data/json', {recursive: true});

await esbuild.build({
  entryPoints: ["src/jpostcode.ts"],
  outfile: "dist/index.cjs.js",
  bundle: true,
  platform: "node",
  target: "esnext",
  minify: true,
  sourcemap: true,
  format: "cjs"
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
    js: 'import path from "node:path"; import { fileURLToPath } from "node:url"; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);'
  }
}).catch((e) => {
  console.log(e);
  process.exit(1);
}).then(() => console.log("done esm build"));
