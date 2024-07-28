import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { RabbitMQProducerService } from '@modules/rabbitmq/services/rabbitmq.producer.services';
import { RabbitMQHeaderType } from '@/modules/rabbitmq/enums/rabbitmq.header.type.enum';
import { CreateReceivableDto } from '../dtos/receivable.create.dto';
import { PaymentMethod } from '../enums/payment-method.enum';
import { ReceivableStatus } from '../enums/receivable-status';
import { addDays, format } from 'date-fns';

@Injectable()
export class TransactionService {
    private readonly FEE_DEBIT: number = 2;
    private readonly FEE_CREDIT: number = 4;
    private readonly DPLUS_DEBIT: number = 0;
    private readonly DPLUS_CREDIT: number = 30;

    constructor(private readonly rabbitMQProducerService: RabbitMQProducerService) {}

    async process(createPaymentDto: CreatePaymentDto): Promise<boolean> {
        console.log(this.createReceivable(createPaymentDto));

        return this.rabbitMQProducerService.sendMessage<CreatePaymentDto>(
            createPaymentDto,
            RabbitMQHeaderType.TRANSACTION,
        );
    }

    private createReceivable(createPaymentDto: CreatePaymentDto): CreateReceivableDto {
        return createPaymentDto.paymentMethod === PaymentMethod.DEBIT_CARD
            ? this.createReceivableForDebit(createPaymentDto)
            : this.createReceivableForCredit(createPaymentDto);
    }

    private createReceivableForDebit(createPaymentDto: CreatePaymentDto): CreateReceivableDto {
        const { discount, total } = this.calculateProcessingFee(createPaymentDto.total, this.FEE_DEBIT);
        return new CreateReceivableDto({
            merchantId: createPaymentDto.merchantId,
            status: ReceivableStatus.PAID,
            createDate: this.getDate(this.DPLUS_DEBIT),
            subtotal: createPaymentDto.total,
            discount,
            total,
        });
    }

    private createReceivableForCredit(createPaymentDto: CreatePaymentDto): CreateReceivableDto {
        const { discount, total } = this.calculateProcessingFee(createPaymentDto.total, this.FEE_CREDIT);
        return new CreateReceivableDto({
            merchantId: createPaymentDto.merchantId,
            status: ReceivableStatus.PAID,
            createDate: this.getDate(this.DPLUS_CREDIT),
            subtotal: createPaymentDto.total,
            discount,
            total,
        });
    }

    private getDate(daysPlus: number): string {
        const currentDate = new Date();
        const newDate = addDays(currentDate, daysPlus);
        return format(newDate, 'yyyy-MM-dd');
    }

    private calculateProcessingFee(value: number, fee: number): { discount: number; total: number } {
        const result = value * (fee / 100);
        const discount = Math.round(result * 100) / 100;
        const total = value - discount;

        return { discount, total };
    }
}
