import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQProducerService } from '@modules/rabbitmq/services/rabbitmq.producer.services';
import { PostgreSqlTransactionsExpService } from '@/modules/postgresql/services/postgresql.transactions.service';
import { RabbitMQHeaderType } from '@/modules/rabbitmq/enums/rabbitmq.header.type.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PayablesStatus } from '../enums/payables-status.enum';
import { TransactionService } from './transaction.service';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { CreatePayablesDto } from '../dtos/payables.create.dto';
import { PayablesTotalDto } from '../dtos/payables.total.dto';
import { PayablesEntity } from '@modules/postgresql/entities/payables.entity';
import { format, addDays } from 'date-fns';

describe('TransactionService', () => {
    let service: TransactionService;
    let rabbitMQProducerService: RabbitMQProducerService;
    let postgreSqlTransactionsExpService: PostgreSqlTransactionsExpService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionService,
                {
                    provide: RabbitMQProducerService,
                    useValue: {
                        sendMessage: jest.fn(),
                    },
                },
                {
                    provide: PostgreSqlTransactionsExpService,
                    useValue: {
                        getPayabless: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<TransactionService>(TransactionService);
        rabbitMQProducerService = module.get<RabbitMQProducerService>(RabbitMQProducerService);
        postgreSqlTransactionsExpService = module.get<PostgreSqlTransactionsExpService>(
            PostgreSqlTransactionsExpService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('process', () => {
        it('should send a message to RabbitMQ', async () => {
            const createPaymentDto: CreatePaymentDto = {
                total: 100,
                merchantId: 1,
                description: 'Test payment',
                paymentMethod: PaymentMethod.DEBIT_CARD,
                cardNumber: '1234',
                cardHolder: 'John Doe',
                cardExpirationDate: '12/2023',
                cardCVV: '123',
            };

            const expectedPayables: CreatePayablesDto = {
                merchantId: 1,
                status: PayablesStatus.PAID,
                createDate: expect.any(String),
                subtotal: 100,
                discount: 2,
                total: 98,
            };

            await service.process(createPaymentDto);

            expect(rabbitMQProducerService.sendMessage).toHaveBeenCalledWith(
                {
                    payment: createPaymentDto,
                    payables: expectedPayables,
                },
                RabbitMQHeaderType.TRANSACTION,
            );
        });
    });

    describe('createPayables', () => {
        it('should create a payables for a debit card payment', () => {
            const createPaymentDto: CreatePaymentDto = {
                total: 100,
                merchantId: 1,
                description: 'Test payment',
                paymentMethod: PaymentMethod.DEBIT_CARD,
                cardNumber: '1234',
                cardHolder: 'John Doe',
                cardExpirationDate: '12/2023',
                cardCVV: '123',
            };

            const payables = service['createPayables'](createPaymentDto);

            expect(payables).toEqual({
                merchantId: 1,
                status: PayablesStatus.PAID,
                createDate: expect.any(String),
                subtotal: 100,
                discount: 2,
                total: 98,
            });
        });

        it('should create a payables for a credit card payment', () => {
            const createPaymentDto: CreatePaymentDto = {
                total: 100,
                merchantId: 1,
                description: 'Test payment',
                paymentMethod: PaymentMethod.CREDIT_CARD,
                cardNumber: '1234',
                cardHolder: 'John Doe',
                cardExpirationDate: '12/2023',
                cardCVV: '123',
            };

            const payables = service['createPayables'](createPaymentDto);

            expect(payables).toEqual({
                merchantId: 1,
                status: PayablesStatus.WAITING_FUNDS,
                createDate: expect.any(String),
                subtotal: 100,
                discount: 4,
                total: 96,
            });
        });
    });

    describe('calculateProcessingFee', () => {
        it('should calculate the correct processing fee', () => {
            const { discount, total } = service['calculateProcessingFee'](100, 4);
            expect(discount).toBe(4);
            expect(total).toBe(96);
        });
    });

    describe('getDate', () => {
        it('should return the correct date with days added', () => {
            const daysPlus = 30;
            const expectedDate = format(addDays(new Date(), daysPlus), 'yyyy-MM-dd');
            const result = service['getDate'](daysPlus);
            expect(result).toBe(expectedDate);
        });
    });

    describe('calculatePayabless', () => {
        it('should return the correct payables totals', async () => {
            const merchantId = 1;
            const startDate = new Date('2023-01-01');
            const endDate = new Date('2023-12-31');
            const paidPayables: PayablesEntity[] = [
                {
                    total: 100,
                    discount: 2,
                    merchantId,
                    status: PayablesStatus.PAID,
                    createDate: new Date(),
                } as PayablesEntity,
                {
                    total: 200,
                    discount: 4,
                    merchantId,
                    status: PayablesStatus.PAID,
                    createDate: new Date(),
                } as PayablesEntity,
            ];
            const waitingFundsPayables: PayablesEntity[] = [
                {
                    total: 300,
                    discount: 6,
                    merchantId,
                    status: PayablesStatus.WAITING_FUNDS,
                    createDate: new Date(),
                } as PayablesEntity,
                {
                    total: 400,
                    discount: 8,
                    merchantId,
                    status: PayablesStatus.WAITING_FUNDS,
                    createDate: new Date(),
                } as PayablesEntity,
            ];

            jest.spyOn(postgreSqlTransactionsExpService, 'getPayabless').mockImplementation(
                (id, start, end, status) => {
                    if (status === PayablesStatus.PAID) {
                        return Promise.resolve(paidPayables);
                    } else {
                        return Promise.resolve(waitingFundsPayables);
                    }
                },
            );

            const result = await service.calculatePayabless(merchantId, startDate, endDate);

            expect(result).toEqual({
                totalPaid: 300,
                totalDiscounts: 6,
                totalWaitingFunds: 700,
            });
        });
    });
});
