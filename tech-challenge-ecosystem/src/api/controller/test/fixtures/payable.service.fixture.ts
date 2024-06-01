import { Payable } from '../../../../core/models/payable';
import { SummarizedPayablesFixture } from './summarized.payable.fixture';


export class PayableServiceFixture {
    summarizeByMerchant = jest.fn((_: Payable[]) => Promise.resolve([SummarizedPayablesFixture.default()]));
}

export const payableServiceFixture = new PayableServiceFixture()