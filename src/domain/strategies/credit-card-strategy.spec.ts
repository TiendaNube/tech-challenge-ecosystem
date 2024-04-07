import { CreditCardStrategy } from './credit-card-strategy';
import { ICalculatePayableResponse } from './payment-strategy';
import { PayableStatus } from '@domain/entities/payable.entity';

describe('CreditCardStrategy', () => {
    const creditCardStrategy = new CreditCardStrategy();

    it('should return object containing the new value, discount and status', () => {
        const total = 100;

        const expectedResult: ICalculatePayableResponse = {
            daysToAdd: 30,
            discount: 4,
            status: PayableStatus.WAIT_FUNDS,
            subTotal: 96,
        };

        const result = creditCardStrategy.calculatePayable(total);
        expect(result).toEqual(expectedResult);
    });
});
