import { HealthCheckResult, HealthIndicatorResult, HealthIndicatorStatus } from '@nestjs/terminus';
import { HealthCheckStatus } from '@nestjs/terminus/dist/health-check';

export class FakeHealthCheckResult implements HealthCheckResult {
    constructor(
        status: HealthCheckStatus,
        details: HealthIndicatorResult,
        info?: HealthIndicatorResult,
        error?: HealthIndicatorResult,
    ) {
        this.status = status;
        this.details = details;
        this.info = info;
        this.error = error;
    }

    status: HealthCheckStatus;
    info?: HealthIndicatorResult;
    error?: HealthIndicatorResult;
    details: HealthIndicatorResult;
}

export class TestUtils {
    public mockScorePostgreSqlService = {
        findOne: jest.fn(),
        calculatePartialScore: jest.fn(),
        insert: jest.fn(),
        delete: jest.fn(),
        getImmersiveExperience: jest.fn(),
    };

    public mockAnswerPostgreSqlService = {
        findLastByCpf: jest.fn(),
        insert: jest.fn(),
    };

    public getHealthIndicatorResult(status: HealthIndicatorStatus): HealthIndicatorResult {
        return {
            healthy: {
                status: status,
            },
        };
    }
}
