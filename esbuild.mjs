import * as esbuild from 'esbuild'

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
  outfile: "dist/index.esm.js",
  bundle: true,
  platform: "node",
  target: "esnext",
  minify: true,
  sourcemap: true,
  format: "esm"
}).catch((e) => {
  console.log(e);
  process.exit(1);
}).then(() => console.log("done esm build"));
