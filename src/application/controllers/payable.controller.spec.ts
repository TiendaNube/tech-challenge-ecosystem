import { PayableSummaryFiltersDto } from './dtos/payable-summary-filters.dto';
import { faker } from '@faker-js/faker';
import { PayableControllerImpl } from './payable.controller';
import { PayableSummary } from '@domain/entities/payable-summary.entity';

describe('PayableControllerImpl', () => {
    const mockGetSummaryPayablesUseCase = {
        execute: jest.fn(),
    };
    const payableController = new PayableControllerImpl(
        mockGetSummaryPayablesUseCase as any,
    );

    it('should call GetSummaryPayablesUseCase execute method with correct filters', async () => {
        const filters: PayableSummaryFiltersDto = {
            merchantId: '1',
            startDate: faker.date.past(),
            endDate: faker.date.future(),
        };
        const expectedResult: PayableSummary = {
            totalPaid: 1000,
            totalFees: 60,
            upcomingPayments: 1000,
        };

        mockGetSummaryPayablesUseCase.execute.mockResolvedValue(expectedResult);
        const result = await payableController.getSummaryPayables(filters);

        expect(mockGetSummaryPayablesUseCase.execute).toHaveBeenCalledWith(
            filters,
        );
        expect(mockGetSummaryPayablesUseCase.execute).toHaveBeenCalledWith(
            filters,
        );
        expect(result).toEqual(expectedResult);
    });
});
