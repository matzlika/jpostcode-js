import { Address } from './address';
import { splitPostalCode, toAddresses } from './lookup';
import type { AddressEntry } from './lookup';

const DEFAULT_BASE_URL = 'https://jpostcode-js.pages.dev/data/json/';

class Jpostcode {
  private static dataCache: { [upper: string]: { [lower: string]: AddressEntry } } = {};
  private static baseUrl: string = DEFAULT_BASE_URL;

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static async find(postalCode: string): Promise<Address[]> {
    const { upper, lower } = splitPostalCode(postalCode);

    if (!this.dataCache[upper]) {
      const response = await fetch(`${this.baseUrl}${upper}.json`);
      if (response.status === 404) {
        // データファイルなし = 存在しない郵便番号帯。負の結果もキャッシュする
        this.dataCache[upper] = {};
      } else if (!response.ok) {
        throw new Error(`jpostcode: failed to fetch postal code data (HTTP ${response.status})`);
      } else {
        this.dataCache[upper] = await response.json();
      }
    }
    return toAddresses(this.dataCache[upper]?.[lower]);
  }
}

export { Jpostcode, Address };
