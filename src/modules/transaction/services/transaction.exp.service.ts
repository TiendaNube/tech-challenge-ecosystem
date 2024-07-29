import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { RabbitMQProducerService } from '@modules/rabbitmq/services/rabbitmq.producer.services';
import { RabbitMQHeaderType } from '@/modules/rabbitmq/enums/rabbitmq.header.type.enum';
import { CreateReceivableDto } from '../dtos/receivable.create.dto';
import { PaymentMethod } from '../enums/payment-method.enum';
import { ReceivableStatus } from '../enums/receivable-status.enum';
import { addDays, format } from 'date-fns';
import { TransactionTransportDto } from '../dtos/transaction.transport';

@Injectable()
export class TransactionExpService {
    constructor() {}

    async process(transactionTransportDto: TransactionTransportDto): Promise<void> {
        console.log(transactionTransportDto);
    }
}
