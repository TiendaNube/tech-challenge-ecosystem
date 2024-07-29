import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { RabbitMQHeaderType } from '../enums/rabbitmq.header.type.enum';
import { Options } from 'amqplib';

/**
 * Serviço responsável por produzir e enviar mensagens para a fila RabbitMQ.
 */
@Injectable()
export class RabbitMQProducerService {
    private readonly queue: string;

    /**
     * Construtor da classe RabbitMQProducerService.
     *
     * @param amqpConnection - Conexão AMQP para comunicação com o RabbitMQ.
     * @param configService - Serviço de configuração para obter valores de configuração.
     */
    constructor(
        private readonly amqpConnection: AmqpConnection,
        private readonly configService: ConfigService,
    ) {
        // Inicializa a fila com o valor obtido das configurações
        this.queue = this.configService.get<string>('RABBITMQ_QUEUE');
    }

    /**
     * Envia uma mensagem para a fila RabbitMQ com um tipo de cabeçalho específico.
     *
     * @param message - A mensagem a ser enviada para a fila.
     * @param headerType - O tipo de cabeçalho da mensagem.
     * @returns Uma promessa que resolve para `true` se a mensagem foi enviada com sucesso, caso contrário `false`.
     */
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
