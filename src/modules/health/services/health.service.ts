import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
    HealthCheckError,
    HealthCheckResult,
    HealthCheckService,
    HealthIndicatorResult,
    HttpHealthIndicator,
} from '@nestjs/terminus';

/**
 * Serviço responsável por realizar verificações de saúde na aplicação.
 */
@Injectable()
export class HealthService {
    private readonly logger = new Logger(HealthService.name);

    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private configService: ConfigService,
        private amqpConnection: AmqpConnection,
    ) {}

    /**
     * Obtém a URL da aplicação a partir das configurações.
     *
     * @returns A URL da aplicação no formato `http://HOST:PORT`.
     */
    getUrl(): string {
        const HOST = this.configService.get<string>('NODE_DOCKER_HOST');
        const PORT = this.configService.get<number>('NODE_DOCKER_PORT');
        return `http://${HOST}:${PORT}`;
    }

    /**
     * Verifica a prontidão da aplicação, incluindo verificações de HTTP e RabbitMQ.
     *
     * @returns Um resultado de verificação de saúde indicando se a aplicação está pronta para receber tráfego.
     */
    async readiness(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.http.pingCheck('Self', this.getUrl()),
            () => this.isRabbitMQHealthy(),
        ]);
    }

    /**
     * Verifica a vivacidade da aplicação através de uma verificação HTTP.
     *
     * @returns Um resultado de verificação de saúde indicando se a aplicação está viva e funcionando corretamente.
     */
    liveness(): Promise<HealthCheckResult> {
        return this.health.check([() => this.http.pingCheck('Self', this.getUrl())]);
    }

    /**
     * Verifica a saúde da conexão RabbitMQ.
     *
     * @returns Um resultado de indicador de saúde indicando o status do RabbitMQ.
     * @throws HealthCheckError se a verificação do RabbitMQ falhar.
     */
    private async isRabbitMQHealthy(): Promise<HealthIndicatorResult> {
        try {
            this.amqpConnection.managedConnection.createChannel();
            return {
                rabbitmq: {
                    status: 'up',
                },
            };
        } catch (error) {
            const err = error as Error;
            throw new HealthCheckError('Verificação do RabbitMQ falhou', {
                rabbitmq: {
                    status: 'down',
                    error: err.message,
                },
            });
        }
    }
}
