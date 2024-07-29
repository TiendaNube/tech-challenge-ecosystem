import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQProducerService } from '@modules/rabbitmq/services/rabbitmq.producer.services';
import { RabbitMQHeaderType } from '@/modules/rabbitmq/enums/rabbitmq.header.type.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { ReceivableStatus } from '../enums/receivable-status.enum';
import { TransactionService } from './transaction.service';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { CreateReceivableDto } from '../dtos/receivable.create.dto';
import { format } from 'date-fns';

describe('TransactionService', () => {
    let service: TransactionService;
    let rabbitMQProducerService: RabbitMQProducerService;

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
            ],
        }).compile();

        service = module.get<TransactionService>(TransactionService);
        rabbitMQProducerService = module.get<RabbitMQProducerService>(RabbitMQProducerService);
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

            const expectedReceivable: CreateReceivableDto = {
                merchantId: 1,
                status: ReceivableStatus.PAID,
                createDate: expect.any(String),
                subtotal: 100,
                discount: 2,
                total: 98,
            };

            await service.process(createPaymentDto);

            expect(rabbitMQProducerService.sendMessage).toHaveBeenCalledWith(
                {
                    payment: createPaymentDto,
                    receivable: expectedReceivable,
                },
                RabbitMQHeaderType.TRANSACTION,
            );
        });
    });

    describe('createReceivable', () => {
        it('should create a receivable for a debit card payment', () => {
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

            const receivable = service['createReceivable'](createPaymentDto);

            expect(receivable).toEqual({
                merchantId: 1,
                status: ReceivableStatus.PAID,
                createDate: expect.any(String),
                subtotal: 100,
                discount: 2,
                total: 98,
            });
        });

        it('should create a receivable for a credit card payment', () => {
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

            const receivable = service['createReceivable'](createPaymentDto);

            expect(receivable).toEqual({
                merchantId: 1,
                status: ReceivableStatus.WAITING_FUNDS,
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
});
