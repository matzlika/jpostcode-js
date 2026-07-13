# Jpostcode

[![npm version](https://img.shields.io/npm/v/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![npm downloads](https://img.shields.io/npm/dm/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![Auto Publish](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml/badge.svg)](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml)
[![license](https://img.shields.io/npm/l/jpostcode.svg)](https://github.com/matzlika/jpostcode-js/blob/main/LICENSE)

**English**: [README.en.md](https://github.com/matzlika/jpostcode-js/blob/main/README.en.md)

郵便番号から日本の住所を検索する JavaScript ライブラリです。フォームの住所自動入力など、外部 API を呼ばずにブラウザや Node.js だけで完結します。

バージョンは `MAJOR.MINOR.YYYYMM` 形式で、`YYYYMM` が収録データの年月です。上の npm version バッジがそのままデータの鮮度を表します(例: `1.0.202607` は 2026 年 7 月版データ)。

## 特徴

- 🔄 **毎月自動更新** — 上流の [jpostcode-data](https://github.com/kufu/jpostcode-data) の更新を検知して新バージョンを npm に自動公開
- 🌐 **公式 CDN あり** — Cloudflare Pages からライブラリ本体と郵便番号データを配信
- ⚡ **API サーバー不要** — ブラウザだけで完結
- 📖 **カナ表記付き** — 都道府県・市区町村・町域それぞれのカナを返す
- 🏢 **事業所個別郵便番号対応** — 大口事業所の名称・番地を含むデータを収録
- 🔀 **複数住所対応** — 同じ郵便番号に複数の住所が紐づく場合は全件を配列で返す
- 🧩 **TypeScript 対応** — 完全な型定義付き
- 📦 **Node / バンドラー / ブラウザ対応** — Node.js のほか、`jpostcode/web` で Vite / webpack などのバンドラーからも使える

## 提供形態

| 形態 | 読み込み方 | API | データの取得 |
| --- | --- | --- | --- |
| [`jpostcode`](#nodejs-commonjs)(Node.js) | `require` / `import` | 同期 | パッケージ同梱の JSON をファイル読み込み |
| [`jpostcode/web`](#バンドラーvite--webpack-react-などのフロントエンド)(バンドラー/ブラウザ) | `import` | Promise | CDN から上 3 桁ごとに fetch |
| [CDN スクリプト版](#クイックスタートブラウザ--cdn) | `<script>` | Promise | 同上 |
| [CDN Bundle 版](#ブラウザbundle-版全データ同梱同期-api) | `<script>` | 同期 | 全データ同梱(約 55MB) |

## クイックスタート(ブラウザ + CDN)

コピペで動きます。

```html
<script src="https://jpostcode-js.pages.dev/dist/jpostcode-web.js"></script>
<script>
  Jpostcode.find('1000001').then(addresses => {
    console.log(addresses[0]?.prefecture); // 東京都
  });
</script>
```

ライブラリ本体・郵便番号データともに [Cloudflare Pages](https://jpostcode-js.pages.dev/) から配信しています。データはデフォルトで公式 CDN から取得します。自前で配信する場合は `Jpostcode.setBaseUrl('/data/json/')` のように取得元を変更できます([データを自前で配信する](#データを自前で配信する))。

- 上流データの月次更新を反映して自動再配信
- 東京を含む Cloudflare エッジから低レイテンシで配信
- gzip / brotli 圧縮配信のため、1 回の検索で取得されるのは上 3 桁ごとの 1 ファイル・転送数 KB〜数十 KB
- JSON データには `s-maxage=2592000`(エッジ 30 日)/ `max-age=86400`(ブラウザ 1 日)のキャッシュヘッダ

## フォーム住所自動入力の例

7 桁の郵便番号が入力されたら、都道府県・市区町村・町域を自動で埋める例です。

```html
<input id="zip" placeholder="郵便番号(例: 1000001)">
<input id="prefecture" placeholder="都道府県">
<input id="city" placeholder="市区町村">
<input id="town" placeholder="町域">

<script src="https://jpostcode-js.pages.dev/dist/jpostcode-web.js"></script>
<script>
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

## インストール(npm)

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

### バンドラー(Vite / webpack)/ React などのフロントエンド

`jpostcode/web` を import します。本体は数 KB で、データは郵便番号の上 3 桁ごとに公式 CDN から fetch します(取得済みデータはメモリにキャッシュ)。

```typescript
import { Jpostcode } from 'jpostcode/web';

const addresses = await Jpostcode.find('1000001'); // Promise<Address[]>
console.log(addresses[0]?.prefecture); // 東京都
```

React でフォームに住所を自動入力する例:

```tsx
import { Jpostcode } from 'jpostcode/web';

function AddressForm() {
  const [address, setAddress] = useState({ prefecture: '', city: '', town: '' });

  const onZipChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/[^0-9]/g, '');
    if (zip.length !== 7) return;
    const [found] = await Jpostcode.find(zip);
    if (found) setAddress({ prefecture: found.prefecture, city: found.city, town: found.town });
  };

  return (
    <>
      <input onChange={onZipChange} placeholder="郵便番号" />
      <input value={address.prefecture} readOnly />
      <input value={address.city} readOnly />
      <input value={address.town} readOnly />
    </>
  );
}
```

データを自前で配信する場合は[データを自前で配信する](#データを自前で配信する)を参照してください。

### ブラウザ・Bundle 版(全データ同梱・同期 API)

すべてのデータを 1 ファイルに同梱した版です。ファイルは約 55MB(gzip 転送で約 4MB)と大きいものの、読み込み後はネットワークを使わず同期 API で呼び出せます。

```html
<script src="https://unpkg.com/jpostcode@latest/dist/jpostcode-web-bundle.js"></script>
<script>
  const addresses = Jpostcode.find('1000001'); // Promise ではなく同期
  console.log(addresses[0]?.prefecture);
</script>
```

Bundle 版はファイルサイズが jsDelivr の配信上限(50MB)を超えるため、unpkg から読み込んでください。通常のフォーム用途には fetch 版(CDN スクリプト版または `jpostcode/web`)を推奨します。

## データを自前で配信する

fetch 版はデフォルトで公式 CDN(`jpostcode-js.pages.dev`)からデータを取得します。このとき入力された郵便番号の上 3 桁が CDN へのリクエストとして送信されます。これを避けたい場合や、配信を自分の環境の管理下に置きたい場合は、データ一式を自前でホストできます。

1. npm パッケージに同梱されているデータ(JSON 951 ファイル・約 56MB)を静的配信ディレクトリにコピーします

   ```bash
   cp -r node_modules/jpostcode/dist/jpostcode-data/data/json public/data/json
   ```

2. 取得元を差し替えます

   ```javascript
   Jpostcode.setBaseUrl('/data/json/');
   ```

- 実際に取得されるのは入力された郵便番号の上 3 桁に対応する 1 ファイル(数 KB〜数百 KB)だけです
- JSON は圧縮がよく効くため(全体で 56MB → gzip 後約 3.8MB)、配信側で gzip / brotli 圧縮を有効にすれば 1 ファイルあたりの転送量は数 KB〜数十 KB になります。ほとんどの静的ホスティング・CDN はデフォルトで圧縮配信します
- ライブラリと別のオリジンから配信する場合は、配信側に `Access-Control-Allow-Origin` ヘッダの設定が必要です(同一オリジンなら不要)
- データの更新は毎月の npm パッケージ更新に含まれます。`npm update jpostcode` 後に再コピーしてください

nginx で配信する場合の設定例です。nginx のデフォルトでは JSON は gzip 対象外のため、`gzip_types` の指定が必要です。

```nginx
location /data/json/ {
    gzip on;
    gzip_types application/json;
    expires 1d;
    add_header Cache-Control "public";
    # 別オリジンのページから参照する場合のみ
    # add_header Access-Control-Allow-Origin "https://example.com";
}
```

## API

### `Jpostcode.find(postalCode)`

- 郵便番号は 7 桁の文字列で指定します。ハイフン付き(`'100-0001'`)も受け付けます
- 返り値は `Address` の配列です。同じ郵便番号に複数の住所が紐づく場合があるためです(複数町域、事業所個別郵便番号など)。存在しない郵便番号の場合は空配列を返します
- Node.js 版(`jpostcode`)は同期で `Address[]` を、Web 版(`jpostcode/web` / CDN スクリプト版)は `Promise<Address[]>` を返します
- Web 版は、データの取得に失敗した場合(ネットワークエラー、HTTP 5xx など)は Promise が reject します。「該当する住所がない」(空配列)とは区別されます

### `Address` のプロパティ

| プロパティ | 型 | 例 |
| --- | --- | --- |
| `zipCode` | `string` | `'1000001'` |
| `prefecture` | `string` | `'東京都'` |
| `prefectureKana` | `string` | `'トウキョウト'` |
| `prefectureCode` | `number` | `13`(JIS 都道府県コード) |
| `city` | `string` | `'千代田区'` |
| `cityKana` | `string` | `'チヨダク'` |
| `town` | `string` | `'千代田'` |
| `townKana` | `string` | `'チヨダ'` |
| `street` | `string \| null` | `'４−３−１城山トラストタワー２３階'`(事業所個別郵便番号のみ) |
| `officeName` | `string \| null` | `'株式会社　スター・チャンネル'`(同上) |
| `officeNameKana` | `string \| null` | 同上のカナ表記 |

`street` / `officeName` / `officeNameKana` は事業所個別郵便番号(大口事業所)の場合に値が入り、通常の住所では `null` です。`JSON.stringify(address)` は上記プロパティ名の JSON を返します。

## 他のライブラリとの比較

郵便番号データは毎月更新されるため、データの鮮度が実用上の差になります(2026 年 7 月時点の npm 公開情報に基づく)。

| ライブラリ | 最終リリース | データの供給方法 | 型定義 |
| --- | --- | --- | --- |
| jpostcode | 毎月(データ更新に追随して自動公開) | パッケージ同梱+公式 CDN | あり |
| [jposta](https://www.npmjs.com/package/jposta) | 2026-06 | パッケージ同梱(リリース時点のデータ) | あり |
| [jp-zipcode-lookup](https://www.npmjs.com/package/jp-zipcode-lookup) | 2025-06 | パッケージ同梱(リリース時点のデータ) | あり |
| [japan-postal-code-oasis](https://www.npmjs.com/package/japan-postal-code-oasis) | 2023-12 | データの自前ホスティングが必要 | なし |
| [japan-postal-code](https://www.npmjs.com/package/japan-postal-code) | 2023-07 | 外部サイトから取得 | なし |
| [yubinbango-core2](https://www.npmjs.com/package/yubinbango-core2) | 2022-05 | yubinbango.github.io から取得(データ最終更新 2026-05) | なし |

取得できる項目にも差があります(各ライブラリの README・型定義に記載された返り値に基づく)。

| ライブラリ | カナ | 事業所個別郵便番号 | 同一番号の複数住所 |
| --- | --- | --- | --- |
| jpostcode | 都道府県・市区町村・町域 | 名称・番地 | 全件を配列で返す |
| jposta | なし | なし | 1 件のみ |
| jp-zipcode-lookup | 都道府県・市区町村のみ | なし | 全件を配列で返す |
| japan-postal-code-oasis | なし | なし | 1 件のみ |
| japan-postal-code | なし | なし | 1 件のみ |
| yubinbango-core2 | なし | なし | 1 件のみ |

## データの鮮度について

- 上流の [jpostcode-data](https://github.com/kufu/jpostcode-data) が月次で日本郵便の最新データを取り込みます
- 本ライブラリは GitHub Actions で上流の更新を検知し、新バージョンを自動で npm / CDN に公開します
- バージョン `MAJOR.MINOR.YYYYMM` の `YYYYMM` がデータ取得時期を表します(例: `1.0.202607` は 2026 年 7 月版)
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
npm run build  # CommonJS / ESM / jpostcode/web / ブラウザ版を生成
npm test
```

## 貢献

issue や Pull Request を歓迎します。

## 謝辞

このライブラリは [jpostcode-data](https://github.com/kufu/jpostcode-data) (Copyright 2023 SmartHR, Inc., MIT License) のデータを使用しています。メンテナと貢献者の皆様に感謝いたします。

## ライセンス

[MIT](https://github.com/matzlika/jpostcode-js/blob/main/LICENSE)。サードパーティ著作権表示は [NOTICE](https://github.com/matzlika/jpostcode-js/blob/main/NOTICE) を参照してください。
