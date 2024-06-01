import { Test, TestingModule } from '@nestjs/testing';
import { PAYABLE_DATASOURCE_PROVIDE } from '../../../contracts/data/payable.datasource';
import { PayableFixture } from '../../../models/test/fixtures/payable.fixture';
import { TransactionFixture } from '../../../models/test/fixtures/transaction.fixture';
import { PAYABLE_SERVICE_PROVIDE, PayableService } from '../payable.service';
import { PAYABLE_FROM_TRANSACTION_BUSINESS_PROVIDE } from '../../../business/payable/payable.from.transaction.business';
import { payableFromTransactionBusinessFixture } from '../../../business/test/fixture/payable.from.transaction.business.fixture';
import { summarizePayableBusinessFixture } from '../../../business/test/fixture/summarize.payable.business.fixture';
import { SUMMARIZE_PAYABLE_BUSINESS_PROVIDE } from '../../../business/payable/summarize.payables.business';
import { payableDatasourceFixture } from '../../../contracts/data/fixtures/payable.datasource.fixture';
import { SummarizedPayablesFixture } from '../../../../api/controller/test/fixtures/summarized.payable.fixture';

describe('PayableService', () => {
  let payableService: PayableService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PAYABLE_SERVICE_PROVIDE,
          useClass: PayableService,
        },
        {
          provide: PAYABLE_FROM_TRANSACTION_BUSINESS_PROVIDE,
          useValue: payableFromTransactionBusinessFixture,
        },
        {
          provide: SUMMARIZE_PAYABLE_BUSINESS_PROVIDE,
          useValue: summarizePayableBusinessFixture,
        },
        {
          provide: PAYABLE_DATASOURCE_PROVIDE,
          useValue: payableDatasourceFixture,
        },
      ],
      exports: [
        {
          provide: PAYABLE_SERVICE_PROVIDE,
          useClass: PayableService,
        },
      ],
    }).compile();

    payableService = app.get<PayableService>(PAYABLE_SERVICE_PROVIDE);

    jest.clearAllMocks();
  });

  describe('PayableService.createPayableFromTransaction', () => {
    it('should create payable from transaction', async () => {
      const transaction = TransactionFixture.default();
      const payable = PayableFixture.default();

      payableFromTransactionBusinessFixture.createPayable.mockReturnValueOnce(
        payable,
      );

      payableDatasourceFixture.create.mockResolvedValueOnce(payable);

      const result =
        await payableService.createPayableFromTransaction(transaction);

      expect(
        payableFromTransactionBusinessFixture.createPayable,
      ).toHaveBeenCalledWith(transaction);
      expect(payableDatasourceFixture.create).toHaveBeenCalledWith(payable);
      expect(result).toEqual(payable);
    });
  });

  describe('PayableService.summarizeByMerchant', () => {
    it('should summarize payables', async () => {
      const payables = [PayableFixture.default()];
      const summarizedPayables = [SummarizedPayablesFixture.default()];

      summarizePayableBusinessFixture.summarize.mockReturnValueOnce(
        summarizedPayables,
      );

      payableDatasourceFixture.listByMerchantId.mockResolvedValueOnce(payables);

      const merchantId = 123;
      const startDate = new Date();
      const endDate = new Date();

      const result = await payableService.summarizeByMerchant(
        merchantId,
        startDate,
        endDate,
      );

      expect(payableDatasourceFixture.listByMerchantId).toHaveBeenCalledWith(
        merchantId,
        startDate,
        endDate,
      );
      expect(summarizePayableBusinessFixture.summarize).toHaveBeenCalledWith(
        payables,
      );
      expect(result).toEqual(summarizedPayables);
    });
  });
});
