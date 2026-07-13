import * as fs from 'node:fs';
import * as path from 'node:path';
import { Jpostcode, Address } from '../src/web';

const DATA_DIR = path.join(__dirname, '../jpostcode-data/data/json');

let fetchMock: jest.Mock;

beforeEach(() => {
  (Jpostcode as any).dataCache = {};
  fetchMock = jest.fn(async (url: string) => {
    const upper = url.match(/(\d{3})\.json$/)?.[1];
    const file = upper ? path.join(DATA_DIR, `${upper}.json`) : '';
    if (!file || !fs.existsSync(file)) {
      return { ok: false, status: 404, json: async () => ({}) };
    }
    return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync(file).toString()) };
  });
  (globalThis as any).fetch = fetchMock;
});

describe('Jpostcode (web)', () => {
  test('should find addresses by postal code', async () => {
    const addresses = await Jpostcode.find('0010000');
    expect(addresses.length).toBeGreaterThan(0);
    const address = addresses[0]!;
    expect(address).toBeInstanceOf(Address);
    expect(address.prefecture).toBe('北海道');
    expect(address.city).toBe('札幌市北区');
    expect(address.zipCode).toBe('0010000');
  });

  test('should accept hyphenated postal codes', async () => {
    const [address] = await Jpostcode.find('100-0001');
    expect(address?.prefecture).toBe('東京都');
    expect(address?.city).toBe('千代田区');
    expect(address?.town).toBe('千代田');
  });

  test('should expose office address fields', async () => {
    const [address] = await Jpostcode.find('1056050');
    expect(address?.officeName).toBeTruthy();
    expect(address?.street).toBeTruthy();
  });

  test('should return null office fields for regular addresses', async () => {
    const [address] = await Jpostcode.find('1000001');
    expect(address?.street).toBeNull();
    expect(address?.officeName).toBeNull();
    expect(address?.officeNameKana).toBeNull();
  });

  test('should cache data files per upper 3 digits', async () => {
    await Jpostcode.find('1000001');
    await Jpostcode.find('1000002');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('should return an empty array for a non-existent postal code', async () => {
    expect(await Jpostcode.find('1009999')).toEqual([]);
  });

  test('should return an empty array when the data file is missing (404)', async () => {
    expect(await Jpostcode.find('9999999')).toEqual([]);
  });

  test('should cache the 404 result and not refetch the same upper digits', async () => {
    await Jpostcode.find('9999999');
    await Jpostcode.find('9990000');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test('should reject when fetch fails with a network error', async () => {
    (globalThis as any).fetch = jest.fn(async () => {
      throw new Error('network error');
    });
    await expect(Jpostcode.find('1000001')).rejects.toThrow('network error');
  });

  test('should reject on server errors', async () => {
    (globalThis as any).fetch = jest.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }));
    await expect(Jpostcode.find('1000001')).rejects.toThrow('HTTP 500');
  });

  test('should serialize Address to a flat camelCase object', async () => {
    const [address] = await Jpostcode.find('1000001');
    expect(JSON.parse(JSON.stringify(address))).toEqual({
      zipCode: '1000001',
      prefecture: '東京都',
      prefectureKana: 'トウキョウト',
      prefectureCode: 13,
      city: '千代田区',
      cityKana: 'チヨダク',
      town: '千代田',
      townKana: 'チヨダ',
      street: null,
      officeName: null,
      officeNameKana: null
    });
  });
});
