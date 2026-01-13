const stripNonDigits = (value: string) => value.replace(/\D/g, '');

export const isValidPesel = (rawPesel: string): boolean => {
  const pesel = stripNonDigits(rawPesel);
  if (pesel.length !== 11) return false;

  const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
  const checksum = weights.reduce((sum, weight, index) => {
    return sum + weight * Number.parseInt(pesel[index], 10);
  }, 0);

  const controlDigit = (10 - (checksum % 10)) % 10;
  return controlDigit === Number.parseInt(pesel[10], 10);
};

export const isValidNip = (rawNip: string): boolean => {
  const nip = stripNonDigits(rawNip);
  if (nip.length !== 10) return false;

  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const checksum = weights.reduce((sum, weight, index) => {
    return sum + weight * Number.parseInt(nip[index], 10);
  }, 0);

  const controlDigit = checksum % 11;
  if (controlDigit === 10) return false;

  return controlDigit === Number.parseInt(nip[9], 10);
};
