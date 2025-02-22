const { Jpostcode, Address } = require('../dist/cjs/index.js');

describe('Jpostcode', () => {
  test('should find an address by postal code', () => {
    const address = Jpostcode.find('0010000');
    expect(address).toBeInstanceOf(Address);
    expect(address?.prefecture).toBe('北海道');
    expect(address?.prefecture_kana).toBe('ホッカイドウ');
    expect(address?.prefecture_code).toBe(1);
    expect(address?.city).toBe('札幌市北区');
    expect(address?.city_kana).toBe('サッポロシキタク');
    expect(address?.town).toBe('');
    expect(address?.town_kana).toBe('');
    expect(address?.zip_code).toBe('0010000');
  });

  test('should return null for a non-existent postal code', () => {
    const address = Jpostcode.find('9999999');
    expect(address).toBeNull();
  });
});
