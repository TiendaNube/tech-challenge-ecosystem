import { faker } from '@faker-js/faker';
import { TransactionControllerImpl } from './transaction.controller';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import {
    Transaction,
    TransactionPaymentMethod,
} from '@domain/entities/transaction.entity';
import { plainToInstance } from 'class-transformer';

describe('TransactionControllerImpl', () => {
    const mockCreateTransactionUseCase = {
        execute: jest.fn(),
    };
    const transactionController = new TransactionControllerImpl(
        mockCreateTransactionUseCase as any,
    );

    it('should call CreateTransactionUseCase execute method with correct data', async () => {
        const createTransactionDto: CreateTransactionDto = {
            merchantId: '1',
            totalValue: faker.number.float(),
            description: faker.lorem.text(),
            paymentMethod: TransactionPaymentMethod.CREDIT_CARD,
            cardNumber: faker.string.numeric(4),
            cardHolder: faker.person.fullName(),
            cardExpirationDate: faker.date.soon(),
            cardCvv: faker.string.numeric(3),
        };
        const expectedResult: Transaction = plainToInstance(
            Transaction,
            createTransactionDto,
        );

        mockCreateTransactionUseCase.execute.mockResolvedValue(
            createTransactionDto,
        );
        const result =
            await transactionController.createTransaction(createTransactionDto);

        expect(mockCreateTransactionUseCase.execute).toHaveBeenCalledWith(
            createTransactionDto,
        );
        expect(result).toEqual(expectedResult);
    });
});
