export class PayableFromTransactionBusinessFixture {
  createPayable = jest.fn();
}

export const payableFromTransactionBusinessFixture =
  new PayableFromTransactionBusinessFixture();
