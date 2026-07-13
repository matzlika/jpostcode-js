import * as fs from 'node:fs';
import * as path from 'node:path';
import { Address } from './address';
import { splitPostalCode, toAddresses } from './lookup';

class Jpostcode {
  private static DATA_DIR = [
    path.join(__dirname, './jpostcode-data/data/json'),
    path.join(__dirname, '../jpostcode-data/data/json')
  ].find((dir) => fs.existsSync(dir)) ?? path.join(__dirname, './jpostcode-data/data/json');

  static find(postalCode: string): Address[] {
    const { upper, lower } = splitPostalCode(postalCode);
    const file = path.join(this.DATA_DIR, `${upper}.json`);
    if (!fs.existsSync(file)) {
      return [];
    }

    const data = JSON.parse(fs.readFileSync(file).toString());
    return toAddresses(data[lower]);
  }
}

export { Jpostcode, Address };
