import { describe, it, expect } from 'vitest';
import { isValidNip, isValidPesel } from './validators';

// Testy jako maaly przyklad
describe('isValidPesel', () => {
  const validPesels = ['44051401458', '02070803628', '4405-1401-458'];
  const invalidPesels = ['83010461358', '1234567890', 'abcdefghijk'];

  it('akceptuje poprawne numery PESEL', () => {
    validPesels.forEach((pesel) => {
      expect(isValidPesel(pesel)).toBe(true);
    });
  });

  it('odrzuca błędne lub niekompletne numery', () => {
    invalidPesels.forEach((pesel) => {
      expect(isValidPesel(pesel)).toBe(false);
    });
  });
});

describe('isValidNip', () => {
  const validNips = ['8567346215', '1132419179'];
  const invalidNips = ['7791011321', '123456789', 'abcdefghij'];

  it('akceptuje poprawne numery NIP', () => {
    validNips.forEach((nip) => {
      expect(isValidNip(nip)).toBe(true);
    });
  });

  it('odrzuca błędne lub niekompletne numery', () => {
    invalidNips.forEach((nip) => {
      expect(isValidNip(nip)).toBe(false);
    });
  });
});
