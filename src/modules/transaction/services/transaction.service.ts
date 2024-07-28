import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { RabbitMQProducerService } from '@modules/rabbitmq/services/rabbitmq.producer.services';
import { RabbitMQHeaderType } from '@/modules/rabbitmq/enums/rabbitmq.header.type.enum';

@Injectable()
export class TransactionService {
    constructor(private readonly rabbitMQProducerService: RabbitMQProducerService) {}

    async process(createPaymentDto: CreatePaymentDto): Promise<boolean> {
        return this.rabbitMQProducerService.sendMessage<CreatePaymentDto>(
            createPaymentDto,
            RabbitMQHeaderType.TRANSACTION,
        );
    }
}
