import { DebitCardStrategy } from './debit-card-strategy';
import { ICalculatePayableResponse } from './payment-strategy';
import { PayableStatus } from '@domain/entities/payable.entity';

describe('DebitCardStrategy', () => {
    const debitCardStrategy = new DebitCardStrategy();

    it('should return object containing the new value, discount and status', () => {
        const total = 100;

        const expectedResult: ICalculatePayableResponse = {
            daysToAdd: 0,
            discount: 2,
            status: PayableStatus.PAID,
            subTotal: 98,
        };

        const result = debitCardStrategy.calculatePayable(total);
        expect(result).toEqual(expectedResult);
    });
});
