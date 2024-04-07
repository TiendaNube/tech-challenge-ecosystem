import { faker } from '@faker-js/faker';
import { GetSummaryPayablesUseCase } from './get-summary-payables';
import { IPayableRepository } from '@domain/interfaces/payable.repository';
import { PayableSummaryFiltersDto } from '@application/controllers/dtos/payable-summary-filters.dto';
import { PayableSummary } from '@domain/entities/payable-summary.entity';

describe('GetSummaryPayablesUseCase', () => {
    let getSummaryPayablesUseCase: GetSummaryPayablesUseCase;
    let mockPayableRepository: IPayableRepository;

    mockPayableRepository = {
        summaryByMerchantIdAndStartDateAndEndDate: jest.fn(),
    };

    getSummaryPayablesUseCase = new GetSummaryPayablesUseCase(
        mockPayableRepository,
    );

    it('should call summaryByMerchantIdAndStartDateAndEndDate method of repository with correct parameters', async () => {
        const filters: PayableSummaryFiltersDto = {
            merchantId: 'testMerchantId',
            startDate: faker.date.past(),
            endDate: faker.date.future(),
        };
        const expectedSummary: PayableSummary = {
            totalPaid: 1000,
            totalFees: 60,
            upcomingPayments: 1000,
        };

        (
            mockPayableRepository.summaryByMerchantIdAndStartDateAndEndDate as any
        ).mockResolvedValue(expectedSummary);

        const result = await getSummaryPayablesUseCase.execute(filters);

        expect(
            mockPayableRepository.summaryByMerchantIdAndStartDateAndEndDate,
        ).toHaveBeenCalledWith(
            filters.merchantId,
            filters.startDate,
            filters.endDate,
        );
        expect(result).toEqual(expectedSummary);
    });
});
