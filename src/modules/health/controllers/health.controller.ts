import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    @Get('/readiness')
    @HealthCheck()
    @ApiExcludeEndpoint()
    async readiness(): Promise<HealthCheckResult> {
        return this.healthService.readiness();
    }

    @Get('/liveness')
    @HealthCheck()
    @ApiExcludeEndpoint()
    async liveness(): Promise<HealthCheckResult> {
        return this.healthService.liveness();
    }
}
