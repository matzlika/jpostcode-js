const { Jpostcode, Address } = require('../dist/cjs/index.js');

describe('Jpostcode', () => {
  test('should find addresses by postal code', () => {
    const addresses = Jpostcode.find('0010000');
    expect(addresses).toBeInstanceOf(Array);
    expect(addresses.length).toBeGreaterThan(0);
    const address = addresses[0];
    expect(address).toBeInstanceOf(Address);
    expect(address.prefecture).toBe('北海道');
    expect(address.prefecture_kana).toBe('ホッカイドウ');
    expect(address.prefecture_code).toBe(1);
    expect(address.city).toBe('札幌市北区');
    expect(address.city_kana).toBe('サッポロシキタク');
    expect(address.town).toBe('');
    expect(address.town_kana).toBe('');
    expect(address.zip_code).toBe('0010000');
  });

  test('should return an empty array for a non-existent postal code', () => {
    const addresses = Jpostcode.find('9999999');
    expect(addresses).toBeInstanceOf(Array);
    expect(addresses.length).toBe(0);
  });
});
