import { Injectable, Logger } from '@nestjs/common';
import { MessageHandlerErrorBehavior, Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { RabbitMQHeaderType } from '../enums/rabbitmq.header.type.enum';
import { TransactionExpService } from '@/modules/transaction/services/transaction.exp.service';

/**
 * Serviço responsável por consumir mensagens da fila RabbitMQ.
 */
@Injectable()
export class RabbitMQConsumerService {
    private readonly logger = new Logger(RabbitMQConsumerService.name);
    private readonly queue: string;
    private readonly dlq: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly transactionExpService: TransactionExpService,
    ) {
        this.queue = this.configService.get<string>('TECH_CHALLENGE_ECOSYSTEM_QUEUE');
        this.dlq = this.configService.get<string>('TECH_CHALLENGE_ECOSYSTEM_DLQ');
    }

    /**
     * Manipula mensagens recebidas da fila RabbitMQ.
     *
     * @param message - A mensagem recebida da fila.
     * @param properties - As propriedades da mensagem recebida.
     */
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
        console.log('asas');
        try {
            const headerType = properties.properties.headers['x-header-type'];
            if (headerType === RabbitMQHeaderType.TRANSACTION) {
                await this.transactionExpService.process(message);
            } else {
                throw new Error(`Mensagem com tipo de cabeçalho ${headerType} enviada para DLQ.`);
            }
        } catch (error) {
            this.logger.error('Erro ao processar mensagem:', error);
            throw new Nack(false);
        }
    }
}
