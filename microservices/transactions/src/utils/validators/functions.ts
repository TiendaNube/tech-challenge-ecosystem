export const validateCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/[^\d]+/g, '');

  if (
    digits.length !== 11 ||
    digits === '00000000000' ||
    digits === '11111111111' ||
    digits === '22222222222' ||
    digits === '33333333333' ||
    digits === '44444444444' ||
    digits === '55555555555' ||
    digits === '66666666666' ||
    digits === '77777777777' ||
    digits === '88888888888' ||
    digits === '99999999999'
  ) {
    return false;
  }

  const sumFirstDigit = digits
    .slice(0, 9)
    .split('')
    .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
  const revFirstDigit = 11 - (sumFirstDigit % 11);
  const firstDigit =
    revFirstDigit === 10 || revFirstDigit === 11 ? 0 : revFirstDigit;

  if (firstDigit !== parseInt(digits.charAt(9))) {
    return false;
  }

  const sumSecondDigit = digits
    .slice(0, 10)
    .split('')
    .reduce((acc, digit, index) => acc + parseInt(digit) * (11 - index), 0);
  const revSecondDigit = 11 - (sumSecondDigit % 11);
  const secondDigit =
    revSecondDigit === 10 || revSecondDigit === 11 ? 0 : revSecondDigit;

  if (secondDigit !== parseInt(digits.charAt(10))) {
    return false;
  }

  return true;
};
