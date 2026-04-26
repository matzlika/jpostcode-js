# Jpostcode

Jpostcode is a library for finding Japanese addresses by postal code. It provides detailed address information, including prefecture, city, and town names in both Japanese and Kana.

> 🗓 **Auto-updated monthly**: Whenever the upstream [jpostcode-data](https://github.com/kufu/jpostcode-data) ingests Japan Post's latest dataset, this library is automatically published to npm with the refreshed data. Just bump the dependency to stay current.

## Installation

To install the library, use npm:

```bash
npm install jpostcode
```

## Usage

Here's a basic example of how to use the library:

### JavaScript

```javascript
const { Jpostcode } = require('jpostcode');

// Find an address by postal code
const addresses = Jpostcode.find('0010000');

if (addresses.length > 0) {
  // multiple addresses could be found from a postal code.
  for (const address of addresses) {
    console.log(`Prefecture: ${address.prefecture} (${address.prefectureKana})`);
    console.log(`City: ${address.city} (${address.cityKana})`);
    console.log(`Town: ${address.town} (${address.townKana})`);
    console.log(`Zip Code: ${address.zipCode}`);
  }
} else {
  console.log('Address not found.');
}
```

### TypeScript

```typescript
import { Address, Jpostcode } from 'jpostcode';

// Find an address by postal code
const addresses:Address[] = Jpostcode.find('0010000');

if (addresses.length > 0) {
  // multiple addresses could be found from a postal code.
  for (const address of addresses) {
    console.log(`Prefecture: ${address.prefecture} (${address.prefectureKana})`);
    console.log(`City: ${address.city} (${address.cityKana})`);
    console.log(`Town: ${address.town} (${address.townKana})`);
    console.log(`Zip Code: ${address.zipCode}`);
  }
} else {
  console.log('Address not found.');
}
```

### Node.js ESM

```javascript
import { Jpostcode } from 'jpostcode';

const addresses = Jpostcode.find('0010000');
console.log(addresses[0]?.prefecture);
```

### Web Browser Usage

For web applications, you can use either the AJAX version or the Bundle version:

#### AJAX Version (Recommended for most cases)

```html
<!-- Include the AJAX version -->
<script src="https://cdn.jsdelivr.net/npm/jpostcode@latest/dist/jpostcode-web.js"></script>

<script>
// Set the base URL for data files (optional, defaults to './data/json/')
Jpostcode.setBaseUrl('https://your-cdn.com/jpostcode-data/');

// Find an address (returns a Promise)
Jpostcode.find('1000001').then(addresses => {
  if (addresses.length > 0) {
    for (const address of addresses) {
      console.log(`Prefecture: ${address.prefecture}`);
      console.log(`City: ${address.city}`);
      console.log(`Town: ${address.town}`);
    }
  }
});
</script>
```

##### Official Cloudflare CDN Build

Both the library script and the postal code data are published to Cloudflare Pages, so you can drop in the library without npm or self-hosted data:

```html
<script src="https://jpostcode-js.pages.dev/dist/jpostcode-web.js"></script>

<script>
// Point the library at the same CDN for data lookups
Jpostcode.setBaseUrl('https://jpostcode-js.pages.dev/data/json/');

Jpostcode.find('1000001').then(addresses => {
  if (addresses.length > 0) {
    console.log(`Prefecture: ${addresses[0].prefecture}`);
  }
});
</script>
```

- Re-deployed automatically whenever upstream [jpostcode-data](https://github.com/kufu/jpostcode-data) ships a monthly update
- Served from Cloudflare's global edge (including Tokyo) for low latency
- JSON responses ship with `s-maxage=2592000` (30 days at the edge) / `max-age=86400` (1 day in browsers)

#### Bundle Version (All data included)

```html
<!-- Include the bundle version (larger file, but works offline) -->
<script src="https://cdn.jsdelivr.net/npm/jpostcode@latest/dist/jpostcode-web-bundle.js"></script>

<script>
// Find an address (synchronous)
const addresses = Jpostcode.find('1000001');
if (addresses.length > 0) {
  for (const address of addresses) {
    console.log(`Prefecture: ${address.prefecture}`);
    console.log(`City: ${address.city}`);
    console.log(`Town: ${address.town}`);
  }
}
</script>
```

## Features

- **Find Address by Postal Code**: Retrieve detailed address information using a postal code.
- **Handle Non-existent Postal Codes**: Returns empty list if the postal code does not exist.
- **Web Browser Support**: Available in both AJAX and Bundle versions for web applications.
- **TypeScript Support**: Full TypeScript definitions included.
- **Always Up-to-Date Postal Data**: Monthly automated checks against the upstream data source ([jpostcode-data](https://github.com/kufu/jpostcode-data)) trigger a new npm release whenever Japan Post's dataset is refreshed. Versions follow `MAJOR.MINOR.YYYYMM` so the data vintage is visible at a glance.

## Build and Test

To build the project, run:

```bash
npm run build
```

This command generates the Node.js CommonJS / ESM builds and the browser bundles at `dist/jpostcode-web.js` and `dist/jpostcode-web-bundle.js`.

To run tests, use:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Thanks

This project makes use of data from the [jpostcode-data](https://github.com/kufu/jpostcode-data) library. We appreciate the efforts of the maintainers and contributors of this library.

## GitHub Pages Demo

This project includes a GitHub Pages demo site that showcases the library's functionality in Japanese.

### Live Demo

Visit the live demo at: https://matzlika.github.io/jpostcode-js/

### Setting up GitHub Pages

1. Go to your repository's Settings tab
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "GitHub Actions"
4. The site will be automatically deployed when you push to the main branch

### Local Development

To run the demo site locally:

```bash
# Build the project first
npm run build

# Create symbolic link to data files (if not already created)
cd docs && ln -s ../jpostcode-data/data data && cd ..

# Serve the docs directory with any static file server
# For example, using Python:
python -m http.server 8000 --directory docs

# Or using Node.js http-server:
npx http-server docs -p 8000
```

Then open `http://localhost:8000` in your browser.

## License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.

This project bundles data from [jpostcode-data](https://github.com/kufu/jpostcode-data) (Copyright 2023 SmartHR, Inc., MIT License). See [NOTICE](NOTICE) for third-party copyright notices.
