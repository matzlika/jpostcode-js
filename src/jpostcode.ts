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

class Jpostcode {
  private static DATA_DIR = path.join(__dirname, '../dist/jpostcode-data/data/json');

  static find(postalCode: string): Address[] {
    const normalizedCode = postalCode.replace('-', '');
    const upper = normalizedCode.substring(0, 3);
    const lower = normalizedCode.substring(3);
    const file = path.join(this.DATA_DIR, `${upper}.json`);
    if (!fs.existsSync(file)) {
      return [];
    }

    const data = JSON.parse(fs.readFileSync(file).toString());
    const entry = data[lower];
    if (!entry) {
      return [];
    }
    if (entry instanceof Array) {
      const entries:AddressData[] = entry as AddressData[];
      return entries.map((entry) => new Address(entry as AddressData));
    } else {
      return [new Address(entry as AddressData)];
    }
  }
}

export { Jpostcode, Address };
