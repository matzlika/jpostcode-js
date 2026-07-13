// dist/web.mjs (jpostcode/web) の動作確認。
// fetch をローカルの jpostcode-data で差し替えて find() を検証する。
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../jpostcode-data/data/json');

globalThis.fetch = async (url) => {
  const upper = String(url).match(/(\d{3})\.json$/)?.[1];
  const file = upper ? path.join(DATA_DIR, `${upper}.json`) : '';
  if (!file || !fs.existsSync(file)) {
    return { ok: false, json: async () => ({}) };
  }
  return { ok: true, json: async () => JSON.parse(fs.readFileSync(file).toString()) };
};

const { Jpostcode, Address } = await import('../dist/web.mjs');

const [address] = await Jpostcode.find('100-0001');
if (!(address instanceof Address) || address.prefecture !== '東京都' || address.town !== '千代田') {
  console.error('dist/web.mjs check failed:', JSON.stringify(address));
  process.exit(1);
}

const missing = await Jpostcode.find('9999999');
if (missing.length !== 0) {
  console.error('dist/web.mjs check failed: expected empty array for unknown code');
  process.exit(1);
}

console.log('dist/web.mjs OK');
