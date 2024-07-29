import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { HealthService } from '../services/health.service';

/**
 * Controlador responsável por verificar a saúde da aplicação.
 */
@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService) {}

    /**
     * Endpoint para verificar a prontidão da aplicação.
     *
     * @returns Um resultado de verificação de saúde indicando se a aplicação está pronta para receber tráfego.
     */
    @Get('/readiness')
    @HealthCheck()
    @ApiExcludeEndpoint()
    async readiness(): Promise<HealthCheckResult> {
        return this.healthService.readiness();
    }

    /**
     * Endpoint para verificar a vivacidade da aplicação.
     *
     * @returns Um resultado de verificação de saúde indicando se a aplicação está viva e funcionando corretamente.
     */
    @Get('/liveness')
    @HealthCheck()
    @ApiExcludeEndpoint()
    async liveness(): Promise<HealthCheckResult> {
        return this.healthService.liveness();
    }
}
