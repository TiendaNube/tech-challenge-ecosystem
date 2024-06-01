export class TransactionMessageProducerFixture {
  sendMessage = jest.fn();
}

export const transactionMessageProducerFixture =
  new TransactionMessageProducerFixture();
