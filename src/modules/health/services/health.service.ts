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

@Injectable()
export class HealthService {
    private readonly logger = new Logger(HealthService.name);

    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private configService: ConfigService,
        private amqpConnection: AmqpConnection,
    ) {}

    getUrl(): string {
        const HOST = this.configService.get<string>('NODE_DOCKER_HOST');
        const PORT = this.configService.get<number>('NODE_DOCKER_PORT');
        return `http://${HOST}:${PORT}`;
    }

    async readiness(): Promise<HealthCheckResult> {
        return this.health.check([
            () => this.http.pingCheck('Self', this.getUrl()),
            () => this.isRabbitMQHealthy(),
        ]);
    }

    liveness(): Promise<HealthCheckResult> {
        return this.health.check([() => this.http.pingCheck('Self', this.getUrl())]);
    }

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
            throw new HealthCheckError('RabbitMQ check failed', {
                rabbitmq: {
                    status: 'down',
                    error: err.message,
                },
            });
        }
    }
}
