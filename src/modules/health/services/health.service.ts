import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckResult, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class HealthService {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private configService: ConfigService,
    ) {}

    getUrl(): string {
        const HOST = this.configService.get<string>('NODE_DOCKER_HOST');
        const PORT = this.configService.get<number>('NODE_DOCKER_PORT');
        return `http://${HOST}:${PORT}`;
    }

    async readiness(): Promise<HealthCheckResult> {
        return this.health.check([() => this.http.pingCheck('Self', this.getUrl())]);
    }

    liveness(): Promise<HealthCheckResult> {
        return this.health.check([() => this.http.pingCheck('Self', this.getUrl())]);
    }
}
