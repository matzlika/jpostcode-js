// Browser version of Jpostcode library
(function(global) {
    'use strict';

    class Address {
        constructor(data) {
            this.data = data;
        }

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
        static async find(postalCode) {
            const normalizedCode = postalCode.replace('-', '');
            const upper = normalizedCode.substring(0, 3);
            const lower = normalizedCode.substring(3);
            
            try {
                const response = await fetch(`./data/json/${upper}.json`);
                if (!response.ok) {
                    return [];
                }
                
                const data = await response.json();
                const entry = data[lower];
                
                if (!entry) {
                    return [];
                }
                
                if (Array.isArray(entry)) {
                    return entry.map(item => new Address(item));
                } else {
                    return [new Address(entry)];
                }
            } catch (error) {
                console.error('Error fetching postal code data:', error);
                return [];
            }
        }
    }

    // Export for browser
    global.Jpostcode = Jpostcode;
    global.Address = Address;

})(typeof window !== 'undefined' ? window : this);
