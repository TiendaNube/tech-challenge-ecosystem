class PayableTypeormRepositoryFixture {
  public create = jest.fn();
  public find = jest.fn();
  public save = jest.fn();
}

export const payableTypeormRepositoryFixture =
  new PayableTypeormRepositoryFixture();
