import { SummarizedPayablesFixture } from './summarized.payable.fixture';

export class PayableServiceFixture {
  summarizeByMerchant = jest.fn(() =>
    Promise.resolve([SummarizedPayablesFixture.default()]),
  );
}

export const payableServiceFixture = new PayableServiceFixture();
