import { Address } from './address';
import type { AddressData } from './address';

type AddressEntry = AddressData | AddressData[];

function splitPostalCode(postalCode: string): { upper: string; lower: string } {
  const normalized = postalCode.replace(/-/g, '');
  return {
    upper: normalized.substring(0, 3),
    lower: normalized.substring(3)
  };
}

function toAddresses(entry: AddressEntry | undefined): Address[] {
  if (!entry) {
    return [];
  }
  if (Array.isArray(entry)) {
    return entry.map((data) => new Address(data));
  }
  return [new Address(entry)];
}

export { splitPostalCode, toAddresses };
export type { AddressEntry };
