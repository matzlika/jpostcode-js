# Jpostcode

[![npm version](https://img.shields.io/npm/v/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![npm downloads](https://img.shields.io/npm/dm/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![Auto Publish](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml/badge.svg)](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml)
[![license](https://img.shields.io/npm/l/jpostcode.svg)](https://github.com/matzlika/jpostcode-js/blob/main/LICENSE)

**日本語**: [README.md](https://github.com/matzlika/jpostcode-js/blob/main/README.md)

A JavaScript library for looking up Japanese addresses by postal code. Designed for use cases like form address autofill — works in the browser or Node.js with no external API server required.

Versions follow the `MAJOR.MINOR.YYYYMM` format, where `YYYYMM` is the year and month of the bundled dataset. The npm version badge above therefore doubles as a data-freshness indicator (e.g. `1.0.202607` ships the July 2026 dataset).

## Features

- 🔄 **Auto-updated monthly** — A new version is automatically published to npm whenever the upstream [jpostcode-data](https://github.com/kufu/jpostcode-data) refreshes
- 🌐 **Official CDN** — Library script and postal data are served from Cloudflare Pages
- ⚡ **No API server required** — Runs entirely in the browser
- 🧩 **TypeScript ready** — Full type definitions included
- 📦 **Node / bundlers / browsers** — Works in Node.js, and in Vite / webpack projects via `jpostcode/web`

## Distribution formats

| Format | How to load | API | Data source |
| --- | --- | --- | --- |
| [`jpostcode`](#nodejs-commonjs) (Node.js) | `require` / `import` | synchronous | JSON bundled in the package, read from disk |
| [`jpostcode/web`](#bundlers-vite--webpack--react-frontends) (bundlers / browsers) | `import` | Promise | fetched from the CDN per leading 3 digits |
| [CDN script](#quick-start-browser--cdn) | `<script>` | Promise | same as above |
| [CDN bundle](#browser-bundle-all-data-inlined-synchronous-api) | `<script>` | synchronous | all data inlined (~55MB) |

## Quick start (Browser + CDN)

Copy and paste — it just works.

```html
<script src="https://jpostcode-js.pages.dev/dist/jpostcode-web.js"></script>
<script>
  Jpostcode.find('1000001').then(addresses => {
    console.log(addresses[0]?.prefecture); // 東京都
  });
</script>
```

Both the library and postal code data are distributed via [Cloudflare Pages](https://jpostcode-js.pages.dev/). Data is fetched from the official CDN by default; call `Jpostcode.setBaseUrl('/data/json/')` to serve it yourself (see [Self-hosting the data](#self-hosting-the-data)).

- Re-deployed automatically whenever upstream data is updated
- Served from Cloudflare's global edge (including Tokyo) for low latency
- Served with gzip / brotli compression — each lookup fetches one file per upper-3-digit block, a few KB to a few tens of KB over the wire
- JSON responses ship with `s-maxage=2592000` (30 days at the edge) / `max-age=86400` (1 day in browsers)

## Form address autofill example

When a 7-digit postal code is entered, prefecture / city / town fields are filled automatically.

```html
<input id="zip" placeholder="Postal code (e.g. 1000001)">
<input id="prefecture" placeholder="Prefecture">
<input id="city" placeholder="City">
<input id="town" placeholder="Town">

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

## Install (npm)

```bash
npm install jpostcode
```

### Node.js (CommonJS)

```javascript
const { Jpostcode } = require('jpostcode');

const addresses = Jpostcode.find('0010000');
for (const address of addresses) {
  console.log(`${address.prefecture} ${address.city} ${address.town}`);
  console.log(`(Kana: ${address.prefectureKana} ${address.cityKana} ${address.townKana})`);
}
```

### Node.js (ESM) / TypeScript

```typescript
import { Address, Jpostcode } from 'jpostcode';

const addresses: Address[] = Jpostcode.find('0010000');
console.log(addresses[0]?.prefecture);
```

### Bundlers (Vite / webpack) / React frontends

Import `jpostcode/web`. The client itself is a few kilobytes; postal data is fetched from the official CDN per leading 3 digits of the postal code (fetched files are cached in memory).

```typescript
import { Jpostcode } from 'jpostcode/web';

const addresses = await Jpostcode.find('1000001'); // Promise<Address[]>
console.log(addresses[0]?.prefecture); // 東京都
```

Autofilling a form in React:

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
      <input onChange={onZipChange} placeholder="Postal code" />
      <input value={address.prefecture} readOnly />
      <input value={address.city} readOnly />
      <input value={address.town} readOnly />
    </>
  );
}
```

To serve the data yourself, see [Self-hosting the data](#self-hosting-the-data).

### Browser bundle (all data inlined, synchronous API)

This build inlines the entire dataset in a single file. The file is large (~55MB, ~4MB over gzip transfer), but once loaded the API is synchronous and needs no network access.

```html
<script src="https://unpkg.com/jpostcode@latest/dist/jpostcode-web-bundle.js"></script>
<script>
  const addresses = Jpostcode.find('1000001'); // synchronous, not a Promise
  console.log(addresses[0]?.prefecture);
</script>
```

Load the bundle from unpkg — the file exceeds jsDelivr's 50MB size limit. For typical form use cases the fetch-based variants (CDN script or `jpostcode/web`) are recommended.

## Self-hosting the data

By default the fetch-based variants load data from the official CDN (`jpostcode-js.pages.dev`), which means the first 3 digits of the entered postal code are sent to the CDN as a request. To avoid this, or to keep distribution under your own control, you can host the dataset yourself.

1. Copy the dataset bundled in the npm package (951 JSON files, about 56MB) into your static assets directory

   ```bash
   cp -r node_modules/jpostcode/dist/jpostcode-data/data/json public/data/json
   ```

2. Point the library at it

   ```javascript
   Jpostcode.setBaseUrl('/data/json/');
   ```

- Only one file (a few KB to a few hundred KB) is fetched per lookup, corresponding to the first 3 digits of the entered postal code
- The JSON compresses well (56MB total → about 3.8MB gzipped), so with gzip / brotli enabled on the server each file transfers as a few KB to a few tens of KB. Most static hosts and CDNs compress by default
- When serving from a different origin than the page, the server must send an `Access-Control-Allow-Origin` header (not needed for same-origin)
- Data updates ship with the monthly npm package updates; re-copy after `npm update jpostcode`

Example nginx configuration. Note that nginx does not gzip JSON by default, so `gzip_types` is required:

```nginx
location /data/json/ {
    gzip on;
    gzip_types application/json;
    expires 1d;
    add_header Cache-Control "public";
    # Only when referenced from a page on a different origin
    # add_header Access-Control-Allow-Origin "https://example.com";
}
```

## API

### `Jpostcode.find(postalCode)`

- Pass a 7-digit postal code string; hyphenated input (`'100-0001'`) is also accepted
- Returns an array of `Address` objects, since one postal code can map to multiple addresses (multiple towns, business postal codes, etc.). Returns an empty array if the postal code does not exist
- The Node.js entry (`jpostcode`) returns `Address[]` synchronously; the web entries (`jpostcode/web` / CDN script) return `Promise<Address[]>`
- In the web entries, the Promise rejects when fetching data fails (network errors, HTTP 5xx, etc.) — distinct from "no matching address" (an empty array)

### `Address` properties

| Property | Type | Example |
| --- | --- | --- |
| `zipCode` | `string` | `'1000001'` |
| `prefecture` | `string` | `'東京都'` |
| `prefectureKana` | `string` | `'トウキョウト'` |
| `prefectureCode` | `number` | `13` (JIS prefecture code) |
| `city` | `string` | `'千代田区'` |
| `cityKana` | `string` | `'チヨダク'` |
| `town` | `string` | `'千代田'` |
| `townKana` | `string` | `'チヨダ'` |
| `street` | `string \| null` | building/floor detail (business postal codes only) |
| `officeName` | `string \| null` | company name (business postal codes only) |
| `officeNameKana` | `string \| null` | kana reading of the company name |

`street` / `officeName` / `officeNameKana` are populated for individual business postal codes and are `null` for regular addresses. `JSON.stringify(address)` produces a JSON object with the property names above.

## Comparison with other libraries

Japan Post updates the postal code dataset every month, so data freshness is the practical differentiator (based on npm metadata as of July 2026).

| Library | Last release | Data delivery | Types |
| --- | --- | --- | --- |
| jpostcode | monthly (auto-published on upstream data updates) | bundled in package + official CDN | yes |
| [jp-zipcode-lookup](https://www.npmjs.com/package/jp-zipcode-lookup) | 2025-06 | bundled (as of release) | yes |
| [japan-postal-code-oasis](https://www.npmjs.com/package/japan-postal-code-oasis) | 2023-12 | requires self-hosted data | no |
| [japan-postal-code](https://www.npmjs.com/package/japan-postal-code) | 2023-07 | fetched from an external site | no |
| [yubinbango-core2](https://www.npmjs.com/package/yubinbango-core2) | 2019-05 | fetched from yubinbango.github.io (data updated separately) | no |

## Data freshness

- The upstream [jpostcode-data](https://github.com/kufu/jpostcode-data) ingests Japan Post's latest dataset every month
- This library uses GitHub Actions to detect upstream updates and auto-publish a new version to npm and the CDN
- The `YYYYMM` portion of the `MAJOR.MINOR.YYYYMM` version indicates when the data was sourced (e.g. `1.0.202607` is the July 2026 dataset)
- npm users just bump the dependency; CDN users get the latest automatically

## Demo

Live demo: <https://matzlika.github.io/jpostcode-js/>

To run locally:

```bash
npm install
npm run build
mkdir -p docs/dist && cp -r dist/* docs/dist/
npx http-server docs -p 8000
```

## Development

```bash
npm install
npm run build  # builds CommonJS / ESM / jpostcode/web / browser variants
npm test
```

## Contributing

Issues and pull requests are welcome.

## Acknowledgements

This library uses data from [jpostcode-data](https://github.com/kufu/jpostcode-data) (Copyright 2023 SmartHR, Inc., MIT License). Many thanks to its maintainers and contributors.

## License

[MIT](https://github.com/matzlika/jpostcode-js/blob/main/LICENSE). See [NOTICE](https://github.com/matzlika/jpostcode-js/blob/main/NOTICE) for third-party copyright notices.
