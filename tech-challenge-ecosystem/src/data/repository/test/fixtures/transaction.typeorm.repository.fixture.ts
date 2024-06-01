class TransactionTypeormRepositoryFixture {
  public findOneBy = jest.fn();
  public save = jest.fn();
}

export const transactionTypeormRepositoryFixture =
  new TransactionTypeormRepositoryFixture();
