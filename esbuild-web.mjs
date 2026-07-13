import * as esbuild from 'esbuild'
import * as fs from "node:fs";
import * as path from "node:path";

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

// バンドル版のエントリ。全データを埋め込み、同期 API を提供する
const webBundleSource = `
import { Address } from './src/address';
import { splitPostalCode, toAddresses } from './src/lookup';

declare const window: any;

const DATA: any = ${generateDataBundle()};

class Jpostcode {
  static find(postalCode: string): Address[] {
    const { upper, lower } = splitPostalCode(postalCode);
    return toAddresses(DATA[upper]?.[lower]);
  }
}

window.Jpostcode = Jpostcode;
window.Address = Address;

export { Jpostcode, Address };
`;

function generateDataBundle() {
  const dataDir = 'jpostcode-data/data/json';
  const allData = {};

  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const key = path.basename(file, '.json');
        const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
        allData[key] = content;
      }
    }
  }

  return JSON.stringify(allData);
}

// 一時ファイルを作成
fs.writeFileSync('temp-web-bundle.ts', webBundleSource);

// バンドル版をビルド
await esbuild.build({
  entryPoints: ["temp-web-bundle.ts"],
  outfile: "dist/jpostcode-web-bundle.js",
  bundle: true,
  platform: "browser",
  target: "es2017",
  minify: true,
  sourcemap: false,
  format: "iife",
  globalName: "JpostcodeBundle",
  banner: { js: licenseBanner }
}).catch((e) => {
  console.log(e);
  process.exit(1);
}).then(() => console.log("done web bundle build"));

// AJAX版をビルド
await esbuild.build({
  entryPoints: ["src/web-global.ts"],
  outfile: "dist/jpostcode-web.js",
  bundle: true,
  platform: "browser",
  target: "es2017",
  minify: true,
  sourcemap: false,
  format: "iife",
  globalName: "JpostcodeWeb",
  banner: { js: licenseBanner }
}).catch((e) => {
  console.log(e);
  process.exit(1);
}).then(() => console.log("done web ajax build"));

// 一時ファイルを削除
fs.unlinkSync('temp-web-bundle.ts');

console.log("Web builds completed!");
