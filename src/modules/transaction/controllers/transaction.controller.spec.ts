import { Test, TestingModule } from '@nestjs/testing';
import { TransactionServiceController } from './transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { PaymentMethod } from '../enums/payment-method.enum';

describe('TransactionServiceController', () => {
    let controller: TransactionServiceController;
    let service: TransactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionServiceController],
            providers: [
                {
                    provide: TransactionService,
                    useValue: {
                        process: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TransactionServiceController>(TransactionServiceController);
        service = module.get<TransactionService>(TransactionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call TransactionService.process with CreatePaymentDto', async () => {
        const createPaymentDto: CreatePaymentDto = {
            total: 100,
            merchantId: 123,
            description: 'Transaction description',
            paymentMethod: PaymentMethod.DEBIT_CARD,
            cardNumber: '1234',
            cardHolder: 'John Doe',
            cardExpirationDate: '12/2023',
            cardCVV: '123',
        };

        await controller.postTransaction(createPaymentDto);

        expect(service.process).toHaveBeenCalledWith(createPaymentDto);
    });
});
