import { Jpostcode, Address } from '../src/jpostcode';

describe('Jpostcode', () => {
  test('should find addresses by postal code', () => {
    const addresses = Jpostcode.find('0010000');
    expect(addresses).toBeInstanceOf(Array);
    expect(addresses.length).toBeGreaterThan(0);
    const address:Address = addresses[0]!;
    expect(address).toBeInstanceOf(Address);
    expect(address.prefecture).toBe('北海道');
    expect(address.prefectureKana).toBe('ホッカイドウ');
    expect(address.prefectureCode).toBe(1);
    expect(address.city).toBe('札幌市北区');
    expect(address.cityKana).toBe('サッポロシキタク');
    expect(address.town).toBe('');
    expect(address.townKana).toBe('');
    expect(address.zipCode).toBe('0010000');
  });

  test('should support multiple addresse', () => {
    const addresses = Jpostcode.find('0110951');
    expect(addresses).toBeInstanceOf(Array);
    expect(addresses.length).toBeGreaterThan(1);
    addresses.forEach((address) => {
      expect(address).toBeInstanceOf(Address);
    });
  });

  test('should return an empty array for a non-existent postal code', () => {
    const addresses = Jpostcode.find('9999999');
    expect(addresses).toBeInstanceOf(Array);
    expect(addresses.length).toBe(0);
  });
});
