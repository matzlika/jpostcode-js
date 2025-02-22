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

  get prefecture_kana() {
    return this.data.prefecture_kana;
  }

  get prefecture_code() {
    return this.data.prefecture_code;
  }

  get city() {
    return this.data.city;
  }

  get city_kana() {
    return this.data.city_kana;
  }

  get town() {
    return this.data.town;
  }

  get town_kana() {
    return this.data.town_kana;
  }

  get zip_code() {
    return this.data.postcode;
  }
}

class Jpostcode {
  private static DATA_DIR = path.join(__dirname, '../jpostcode-data/data/json');

  static find(postalCode: string): Address[] {
    const normalizedCode = postalCode.replace('-', '');
    const files = fs.readdirSync(this.DATA_DIR);

    const addresses: Address[] = [];
    
    for (const file of files) {
      const filePath = path.join(this.DATA_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      for (const entry of Object.values(data) as AddressData[]) {
        if (entry.postcode === normalizedCode) {
          addresses.push(new Address(entry));
        }
      }
    }

    return addresses;
  }
}

export { Jpostcode, Address };
