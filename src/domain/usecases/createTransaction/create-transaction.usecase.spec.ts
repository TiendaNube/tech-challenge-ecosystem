import { faker } from '@faker-js/faker';
import {
    Transaction,
    TransactionPaymentMethod,
} from '@domain/entities/transaction.entity';
import { plainToInstance } from 'class-transformer';
import { ITransactionRepository } from '@domain/interfaces/transaction.repository';
import { CreateTransactionUseCase } from './create-transaction.usecase';
import { CreateTransactionDto } from '@application/controllers/dtos/create-transaction.dto';

describe('CreateTransactionUseCase', () => {
    const mockTransactionRepository: ITransactionRepository = {
        saveTransaction: jest.fn(),
    };
    const createTransactionUseCase = new CreateTransactionUseCase(
        mockTransactionRepository as any,
    );

    it('should call mockTransactionRepository saveTransaction method with correct data', async () => {
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

        const transaction = plainToInstance(Transaction, createTransactionDto);

        (mockTransactionRepository.saveTransaction as any).mockResolvedValue(
            transaction,
        );

        const result =
            await createTransactionUseCase.execute(createTransactionDto);

        expect(mockTransactionRepository.saveTransaction).toHaveBeenCalledWith(
            transaction,
        );
        expect(result).toEqual(transaction);
    });
});
