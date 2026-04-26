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

// Web版用のソースファイルを作成
const webBundleSource = `
import * as fs from 'fs';
import * as path from 'path';

interface AddressData {
  postcode: string;
  prefecture: string;
  prefecture_kana: string;
  prefecture_code: number;
  city: string;
  city_kana: string;
  town: string;
  town_kana: string;
}

class Address {
  constructor(private data: AddressData) {}

  get prefecture() {
    return this.data.prefecture;
  }

  get prefectureKana() {
    return this.data.prefecture_kana;
  }

  get prefectureCode() {
    return this.data.prefecture_code;
  }

  get city() {
    return this.data.city;
  }

  get cityKana() {
    return this.data.city_kana;
  }

  get town() {
    return this.data.town;
  }

  get townKana() {
    return this.data.town_kana;
  }

  get zipCode() {
    return this.data.postcode;
  }
}

// 全データを埋め込み
const DATA = ${generateDataBundle()};

class Jpostcode {
  static find(postalCode: string): Address[] {
    const normalizedCode = postalCode.replace('-', '');
    const upper = normalizedCode.substring(0, 3);
    const lower = normalizedCode.substring(3);
    
    const data = DATA[upper];
    if (!data) {
      return [];
    }

    const entry = data[lower];
    if (!entry) {
      return [];
    }
    
    if (entry instanceof Array) {
      const entries: AddressData[] = entry as AddressData[];
      return entries.map((entry) => new Address(entry as AddressData));
    } else {
      return [new Address(entry as AddressData)];
    }
  }
}

// Browser export
(window as any).Jpostcode = Jpostcode;
(window as any).Address = Address;

export { Jpostcode, Address };
`;

const webAjaxSource = `
interface AddressData {
  postcode: string;
  prefecture: string;
  prefecture_kana: string;
  prefecture_code: number;
  city: string;
  city_kana: string;
  town: string;
  town_kana: string;
}

class Address {
  constructor(private data: AddressData) {}

  get prefecture() {
    return this.data.prefecture;
  }

  get prefectureKana() {
    return this.data.prefecture_kana;
  }

  get prefectureCode() {
    return this.data.prefecture_code;
  }

  get city() {
    return this.data.city;
  }

  get cityKana() {
    return this.data.city_kana;
  }

  get town() {
    return this.data.town;
  }

  get townKana() {
    return this.data.town_kana;
  }

  get zipCode() {
    return this.data.postcode;
  }
}

class Jpostcode {
  private static dataCache: { [key: string]: any } = {};
  private static baseUrl: string = './data/json/';

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static async find(postalCode: string): Promise<Address[]> {
    const normalizedCode = postalCode.replace('-', '');
    const upper = normalizedCode.substring(0, 3);
    const lower = normalizedCode.substring(3);
    
    try {
      // キャッシュチェック
      if (!this.dataCache[upper]) {
        const response = await fetch(\`\${this.baseUrl}\${upper}.json\`);
        if (!response.ok) {
          return [];
        }
        this.dataCache[upper] = await response.json();
      }
      
      const data = this.dataCache[upper];
      const entry = data[lower];
      
      if (!entry) {
        return [];
      }
      
      if (Array.isArray(entry)) {
        return entry.map((item: AddressData) => new Address(item));
      } else {
        return [new Address(entry as AddressData)];
      }
    } catch (error) {
      console.error('Error fetching postal code data:', error);
      return [];
    }
  }
}

// Browser export
(window as any).Jpostcode = Jpostcode;
(window as any).Address = Address;

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
fs.writeFileSync('temp-web-ajax.ts', webAjaxSource);

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
  entryPoints: ["temp-web-ajax.ts"],
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
fs.unlinkSync('temp-web-ajax.ts');

console.log("Web builds completed!");
