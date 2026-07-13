interface AddressData {
  postcode: string;
  prefecture: string;
  prefecture_kana: string;
  prefecture_code: number;
  city: string;
  city_kana: string;
  town: string;
  town_kana: string;
  street?: string | null;
  office_name?: string | null;
  office_name_kana?: string | null;
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

  get street() {
    return this.data.street ?? null;
  }

  get officeName() {
    return this.data.office_name ?? null;
  }

  get officeNameKana() {
    return this.data.office_name_kana ?? null;
  }

  toJSON() {
    return {
      zipCode: this.zipCode,
      prefecture: this.prefecture,
      prefectureKana: this.prefectureKana,
      prefectureCode: this.prefectureCode,
      city: this.city,
      cityKana: this.cityKana,
      town: this.town,
      townKana: this.townKana,
      street: this.street,
      officeName: this.officeName,
      officeNameKana: this.officeNameKana
    };
  }
}

export { Address };
export type { AddressData };
