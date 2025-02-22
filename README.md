# Jpostcode

Jpostcode is a library for finding Japanese addresses by postal code. It provides detailed address information, including prefecture, city, and town names in both Japanese and Kana.

## Installation

To install the library, use npm:

```bash
npm install jpostcode
```

## Usage

Here's a basic example of how to use the library:

```javascript
const { Jpostcode } = require('jpostcode');

// Find an address by postal code
const address = Jpostcode.find('0010000');

if (address) {
  console.log(`Prefecture: ${address.prefecture} (${address.prefecture_kana})`);
  console.log(`City: ${address.city} (${address.city_kana})`);
  console.log(`Town: ${address.town} (${address.town_kana})`);
  console.log(`Zip Code: ${address.zip_code}`);
} else {
  console.log('Address not found.');
}
```

## Features

- **Find Address by Postal Code**: Retrieve detailed address information using a postal code.
- **Handle Non-existent Postal Codes**: Returns `null` if the postal code does not exist.

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

## License

This project is licensed under the MIT License.
