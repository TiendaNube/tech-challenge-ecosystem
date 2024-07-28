import { Injectable, Logger } from '@nestjs/common';
import {
    AmqpConnection,
    MessageHandlerErrorBehavior,
    Nack,
    RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { RabbitMQHeaderType } from '../enums/rabbitmq.header.type.enum';

@Injectable()
export class RabbitMQConsumerService {
    private readonly logger = new Logger(RabbitMQConsumerService.name);
    private readonly queue: string;
    private readonly dlq: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.queue = this.configService.get<string>('TECH_CHALLENGE_ECOSYSTEM_QUEUE');
        this.dlq = this.configService.get<string>('TECH_CHALLENGE_ECOSYSTEM_DLQ');
    }

    @RabbitSubscribe({
        exchange: '',
        routingKey: '',
        queue: process.env.RABBITMQ_QUEUE,
        errorBehavior: MessageHandlerErrorBehavior.NACK,
        queueOptions: {
            arguments: {
                'x-dead-letter-exchange': '',
                'x-dead-letter-routing-key': process.env.RABBITMQ_DEAD_LETTER_ROUTING_KEY,
            },
        },
    })
    public async handleMessage(message: any, properties: any) {
        try {
            const headerType = properties.properties.headers['x-header-type'];
            if (headerType === RabbitMQHeaderType.TRANSACTION) {
                console.log(`Processing message: ${JSON.stringify(message)}`);
            } else {
                throw new Error(`Message with header type ${headerType} sent to DLQ.`);
            }
        } catch (error) {
            this.logger.error('Error processing message:', error);
            throw new Nack(false);
        }
    }
}
