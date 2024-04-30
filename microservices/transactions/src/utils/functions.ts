export const getLastFourDigits = (number: string) => {
  const cardNumber = String(number) ?? '';

  return cardNumber.length >= 4 ? cardNumber.slice(-4) : cardNumber;
};
