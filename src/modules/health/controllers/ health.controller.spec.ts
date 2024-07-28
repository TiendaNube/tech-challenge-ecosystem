import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from '../services/health.service';
import { HealthCheckResult } from '@nestjs/terminus';

describe('HealthController', () => {
    let healthController: HealthController;
    let healthService: HealthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthService,
                    useValue: {
                        readiness: jest.fn(),
                        liveness: jest.fn(),
                    },
                },
            ],
        }).compile();

        healthController = module.get<HealthController>(HealthController);
        healthService = module.get<HealthService>(HealthService);
    });

    it('should be defined', () => {
        expect(healthController).toBeDefined();
    });

    describe('readiness', () => {
        it('should return the readiness check result', async () => {
            const result: HealthCheckResult = { status: 'ok', info: {}, error: {}, details: {} };
            jest.spyOn(healthService, 'readiness').mockResolvedValue(result);

            expect(await healthController.readiness()).toBe(result);
        });
    });

    describe('liveness', () => {
        it('should return the liveness check result', async () => {
            const result: HealthCheckResult = { status: 'ok', info: {}, error: {}, details: {} };
            jest.spyOn(healthService, 'liveness').mockResolvedValue(result);

            expect(await healthController.liveness()).toBe(result);
        });
    });
});
