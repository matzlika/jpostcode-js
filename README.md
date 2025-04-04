# Jpostcode

Jpostcode is a library for finding Japanese addresses by postal code. It provides detailed address information, including prefecture, city, and town names in both Japanese and Kana.

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

## Features

- **Find Address by Postal Code**: Retrieve detailed address information using a postal code.
- **Handle Non-existent Postal Codes**: Returns empty list if the postal code does not exist.

## Build and Test

To build the project, run:

```bash
npm run build
```

To run tests, use:

```bash
npm test
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Thanks

This project makes use of data from the [jpostcode-data](https://github.com/kufu/jpostcode-data) library. We appreciate the efforts of the maintainers and contributors of this library.

## License

This project is licensed under the MIT License.
