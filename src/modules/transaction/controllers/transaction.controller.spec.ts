import { Test, TestingModule } from '@nestjs/testing';
import { TransactionServiceController } from './transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from '../guards/apikey.guard';
import { PayablesTotalDto } from '../dtos/payables.total.dto';
import { BadRequestException } from '@nestjs/common';
import { parse } from 'date-fns';
import { CreatePaymentDto } from '../dtos/payment.create.dto';

describe('TransactionServiceController', () => {
    let controller: TransactionServiceController;
    let service: TransactionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            controllers: [TransactionServiceController],
            providers: [
                {
                    provide: TransactionService,
                    useValue: {
                        process: jest.fn(),
                        calculatePayabless: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'API_KEY') {
                                return 'your_secure_api_key_here';
                            }
                        }),
                    },
                },
                ApiKeyGuard,
            ],
        }).compile();

        controller = module.get<TransactionServiceController>(TransactionServiceController);
        service = module.get<TransactionService>(TransactionService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('postTransaction', () => {
        it('should call process method of transactionService', async () => {
            const createPaymentDto = {
                merchantId: 123,
                description: 'string3',
                paymentMethod: 'debit_card',
                cardNumber: '3452',
                cardHolder: 'string',
                cardExpirationDate: '12/2024',
                cardCVV: '003',
                total: 400.25,
            } as CreatePaymentDto;
            await controller.postTransaction(createPaymentDto);
            expect(service.process).toHaveBeenCalledWith(createPaymentDto);
        });
    });

    describe('calculatePayabless', () => {
        it('should return calculated payables total', async () => {
            const merchantId = 1;
            const startDate = '01/01/2023';
            const endDate = '31/12/2023';
            const start = parse(startDate, 'dd/MM/yyyy', new Date());
            const end = parse(endDate, 'dd/MM/yyyy', new Date());
            const result: PayablesTotalDto = { totalPaid: 1000, totalDiscounts: 100, totalWaitingFunds: 500 };

            jest.spyOn(service, 'calculatePayabless').mockResolvedValue(result);

            const response = await controller.calculatePayabless(merchantId, startDate, endDate);
            expect(response).toEqual(result);
            expect(service.calculatePayabless).toHaveBeenCalledWith(merchantId, start, end);
        });

        it('should throw BadRequestException for invalid dates', async () => {
            const merchantId = 1;
            const startDate = 'invalid-date';
            const endDate = '31/12/2023';

            await expect(controller.calculatePayabless(merchantId, startDate, endDate)).rejects.toThrow(
                BadRequestException,
            );
        });
    });
});
