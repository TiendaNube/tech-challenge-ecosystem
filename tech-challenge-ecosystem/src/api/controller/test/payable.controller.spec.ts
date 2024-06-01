import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from '../transaction.controller';
import { TRANSACTION_SERVICE_PROVIDE } from '../../../core/services/transaction/transaction.service';
import { TransactionDTOFixture } from './fixtures/transaction.dto.fixture';
import { transactionServiceFixture } from './fixtures/transaction.service.fixture';
import { PayableController } from '../payable.controller';
import { payableServiceFixture } from './fixtures/payable.service.fixture';
import { PAYABLE_SERVICE_PROVIDE } from '../../../core/services/payable/payable.service';
import { SummarizedPayablesFixture } from './fixtures/summarized.payable.fixture';
import { PayableSummaryDTO } from '../../../api/models/payable.summary.dto';

describe('TransactionController', () => {
  let payableController: PayableController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PayableController],
      providers: [
        {
          provide: PAYABLE_SERVICE_PROVIDE,
          useValue: payableServiceFixture,
        },
      ],
    }).compile();

    payableController = app.get<PayableController>(
      PayableController,
    );
  });

  describe('PUT /payable/summary', () => {
    it('should return summary of payables', async () => {
      const queryFilters = {
        merchantId: '1',
        startDate: '2024/12/1',
        endDate: '2024/12/2'
      }

      const expectedDTO = new PayableSummaryDTO()
      expectedDTO.futureAmount = 0
      expectedDTO.paidAmount = SummarizedPayablesFixture.default().amount
      expectedDTO.paidFee = SummarizedPayablesFixture.default().discount

      expect(
        await payableController.summarizeByMerchant(queryFilters)
      ).toEqual(expectedDTO);
    });

    it('should call PayableServices.summarizeByMerchant with converted input', async () => {
      const queryFilters = {
        merchantId: '1',
        startDate: '2024/12/1',
        endDate: '2024/12/2'
      }

      await payableController.summarizeByMerchant(queryFilters)

      expect(payableServiceFixture.summarizeByMerchant).toHaveBeenCalledWith(
        Number(queryFilters.merchantId),
        new Date(queryFilters.startDate),
        new Date(queryFilters.endDate),
      )

    })
  });
});
