import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { RabbitMQHeaderType } from '../enums/rabbitmq.header.type.enum';
import { Options } from 'amqplib';

@Injectable()
export class RabbitMQProducerService {
    private readonly queue: string;

    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly configService: ConfigService,
    ) {
        this.queue = this.configService.get<string>('RABBITMQ_QUEUE');
    }

    async sendMessage<T>(message: T, headerType: RabbitMQHeaderType): Promise<boolean> {
        const options: Options.Publish = {
            headers: {
                'x-header-type': headerType,
            },
        };

        return this.amqpConnection.managedChannel.sendToQueue(
            this.queue,
            Buffer.from(JSON.stringify(message)),
            options,
        );
    }
}
