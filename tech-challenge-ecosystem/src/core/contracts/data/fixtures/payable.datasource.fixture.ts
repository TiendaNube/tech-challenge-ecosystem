export class PayableDatasourceFixture {
  create = jest.fn();
  listByMerchantId = jest.fn();
}

export const payableDatasourceFixture = new PayableDatasourceFixture();
