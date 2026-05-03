# Jpostcode

[![npm version](https://img.shields.io/npm/v/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![npm downloads](https://img.shields.io/npm/dm/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![Auto Publish](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml/badge.svg)](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml)
[![license](https://img.shields.io/npm/l/jpostcode.svg)](LICENSE)

郵便番号から日本の住所を検索する JavaScript ライブラリです。フォームの住所自動入力など、外部 API を呼ばずにブラウザや Node.js だけで完結します。

## 特徴

- 🔄 **毎月自動更新** — 上流の [jpostcode-data](https://github.com/kufu/jpostcode-data) の更新を検知して新バージョンを npm に自動公開（バージョン `MAJOR.MINOR.YYYYMM`）
- 🌐 **公式 CDN あり** — Cloudflare Pages からライブラリ本体と郵便番号データを配信
- ⚡ **API サーバー不要** — ブラウザだけで完結
- 🧩 **TypeScript 対応** — 完全な型定義付き
- 📦 **Node / ESM / ブラウザ対応** — どの環境でも使える

## クイックスタート（ブラウザ + CDN）

コピペで動きます。

```html
<script src="https://jpostcode-js.pages.dev/dist/jpostcode-web.js"></script>
<script>
  Jpostcode.setBaseUrl('https://jpostcode-js.pages.dev/data/json/');

  Jpostcode.find('1000001').then(addresses => {
    console.log(addresses[0]?.prefecture); // 東京都
  });
</script>
```

ライブラリ本体・郵便番号データともに [Cloudflare Pages](https://jpostcode-js.pages.dev/) から配信しています。

- 上流データの月次更新を反映して自動再配信
- 東京を含む Cloudflare エッジから低レイテンシで配信
- JSON データには `s-maxage=2592000`（エッジ 30 日）/ `max-age=86400`（ブラウザ 1 日）のキャッシュヘッダ

## フォーム住所自動入力の例

7 桁の郵便番号が入力されたら、都道府県・市区町村・町域を自動で埋める例です。

```html
<input id="zip" placeholder="郵便番号（例: 1000001）">
<input id="prefecture" placeholder="都道府県">
<input id="city" placeholder="市区町村">
<input id="town" placeholder="町域">

<script src="https://jpostcode-js.pages.dev/dist/jpostcode-web.js"></script>
<script>
  Jpostcode.setBaseUrl('https://jpostcode-js.pages.dev/data/json/');

  document.getElementById('zip').addEventListener('input', async (e) => {
    const zip = e.target.value.replace(/[^0-9]/g, '');
    if (zip.length !== 7) return;

    const [address] = await Jpostcode.find(zip);
    if (!address) return;

    document.getElementById('prefecture').value = address.prefecture;
    document.getElementById('city').value = address.city;
    document.getElementById('town').value = address.town;
  });
</script>
```

## インストール（npm）

```bash
npm install jpostcode
```

### Node.js (CommonJS)

```javascript
const { Jpostcode } = require('jpostcode');

const addresses = Jpostcode.find('0010000');
for (const address of addresses) {
  console.log(`${address.prefecture} ${address.city} ${address.town}`);
  console.log(`(カナ: ${address.prefectureKana} ${address.cityKana} ${address.townKana})`);
}
```

### Node.js (ESM) / TypeScript

```typescript
import { Address, Jpostcode } from 'jpostcode';

const addresses: Address[] = Jpostcode.find('0010000');
console.log(addresses[0]?.prefecture);
```

`Jpostcode.find()` は配列を返します（同じ郵便番号に複数住所が紐づく場合があるため）。郵便番号が存在しない場合は空配列を返します。

### ブラウザ・Bundle 版（全データ同梱・同期 API）

すべてのデータを JS に同梱するためファイルサイズは大きくなりますが、ネットワークを使わずに同期 API で呼び出せます。

```html
<script src="https://cdn.jsdelivr.net/npm/jpostcode@latest/dist/jpostcode-web-bundle.js"></script>
<script>
  const addresses = Jpostcode.find('1000001'); // Promise ではなく同期
  console.log(addresses[0]?.prefecture);
</script>
```

## データの鮮度について

- 上流の [jpostcode-data](https://github.com/kufu/jpostcode-data) が月次で日本郵便の最新データを取り込みます
- 本ライブラリは GitHub Actions で上流の更新を検知し、新バージョンを自動で npm / CDN に公開します
- バージョン `MAJOR.MINOR.YYYYMM` の `YYYYMM` がデータ取得時期を表します（例: `1.0.202605` は 2026 年 5 月版）
- npm を使う場合は依存を更新するだけ、CDN を使う場合は何もしなくても最新になります

## デモ

ライブデモ: <https://matzlika.github.io/jpostcode-js/>

ローカルで動かす場合:

```bash
npm install
npm run build
mkdir -p docs/dist && cp -r dist/* docs/dist/
npx http-server docs -p 8000
```

## 開発

```bash
npm install
npm run build  # CommonJS / ESM / ブラウザ版を生成
npm test
```

## 貢献

issue や Pull Request を歓迎します。

## 謝辞

このライブラリは [jpostcode-data](https://github.com/kufu/jpostcode-data) (Copyright 2023 SmartHR, Inc., MIT License) のデータを使用しています。メンテナと貢献者の皆様に感謝いたします。

## ライセンス

[MIT](LICENSE)。サードパーティ著作権表示は [NOTICE](NOTICE) を参照してください。

---

**English**: [README.en.md](README.en.md)
