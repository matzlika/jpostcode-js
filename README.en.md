# Jpostcode

[![npm version](https://img.shields.io/npm/v/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![npm downloads](https://img.shields.io/npm/dm/jpostcode.svg)](https://www.npmjs.com/package/jpostcode)
[![Auto Publish](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml/badge.svg)](https://github.com/matzlika/jpostcode-js/actions/workflows/auto-publish.yml)
[![license](https://img.shields.io/npm/l/jpostcode.svg)](LICENSE)

A JavaScript library for looking up Japanese addresses by postal code. Designed for use cases like form address autofill — works in the browser or Node.js with no external API server required.

## Features

- 🔄 **Auto-updated monthly** — A new version is automatically published to npm whenever the upstream [jpostcode-data](https://github.com/kufu/jpostcode-data) refreshes (versioned as `MAJOR.MINOR.YYYYMM`)
- 🌐 **Official CDN** — Library script and postal data are served from Cloudflare Pages
- ⚡ **No API server required** — Runs entirely in the browser
- 🧩 **TypeScript ready** — Full type definitions included
- 📦 **Node / ESM / Browser** — Works everywhere

## Quick start (Browser + CDN)

Copy and paste — it just works.

```html
<script src="https://jpostcode-js.pages.dev/dist/jpostcode-web.js"></script>
<script>
  Jpostcode.setBaseUrl('https://jpostcode-js.pages.dev/data/json/');

  Jpostcode.find('1000001').then(addresses => {
    console.log(addresses[0]?.prefecture); // 東京都
  });
</script>
```

Both the library and postal code data are distributed via [Cloudflare Pages](https://jpostcode-js.pages.dev/).

- Re-deployed automatically whenever upstream data is updated
- Served from Cloudflare's global edge (including Tokyo) for low latency
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

`Jpostcode.find()` returns an array (a single postal code can map to multiple addresses). It returns an empty array if the postal code does not exist.

### Browser bundle (all data inlined, synchronous API)

The bundle build inlines all postal data, so the file is large but you can call the API synchronously without any network requests.

```html
<script src="https://cdn.jsdelivr.net/npm/jpostcode@latest/dist/jpostcode-web-bundle.js"></script>
<script>
  const addresses = Jpostcode.find('1000001'); // synchronous, not a Promise
  console.log(addresses[0]?.prefecture);
</script>
```

## Data freshness

- The upstream [jpostcode-data](https://github.com/kufu/jpostcode-data) ingests Japan Post's latest dataset every month
- This library uses GitHub Actions to detect upstream updates and auto-publish a new version to npm and the CDN
- The `YYYYMM` portion of the `MAJOR.MINOR.YYYYMM` version indicates when the data was sourced (e.g. `1.0.202605` is the May 2026 dataset)
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
npm run build  # builds CommonJS / ESM / browser variants
npm test
```

## Contributing

Issues and pull requests are welcome.

## Acknowledgements

This library uses data from [jpostcode-data](https://github.com/kufu/jpostcode-data) (Copyright 2023 SmartHR, Inc., MIT License). Many thanks to its maintainers and contributors.

## License

[MIT](LICENSE). See [NOTICE](NOTICE) for third-party copyright notices.

---

**日本語**: [README.md](README.md)
