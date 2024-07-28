import { Test, TestingModule } from '@nestjs/testing';
import { FakeHealthCheckResult, TestUtils } from '@commons/test/test.utils';
import { HealthController } from './health.controller';
import { HealthService } from '../services/health.service';

describe('HealthController', () => {
    let healthController: HealthController;
    const testeUtils = new TestUtils();

    const mockHealthService = {
        readiness: jest.fn(),
        liveness: jest.fn(),
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthService,
                    useValue: mockHealthService,
                },
            ],
        }).compile();

        healthController = app.get<HealthController>(HealthController);
    });

    describe('root', () => {
        it('should be defined"', () => {
            expect(healthController).toBeDefined();
        });
    });

    describe('readiness', () => {
        it('should return an object HealthCheckResult"', async () => {
            mockHealthService.readiness.mockImplementationOnce(
                () =>
                    new Promise(resolve => {
                        resolve(
                            new FakeHealthCheckResult(
                                'ok',
                                testeUtils.getHealthIndicatorResult('up'),
                            ),
                        );
                    }),
            );

            const { status } = await healthController.readiness();

            expect(status).toBe('ok');
        });
    });

    describe('liveness', () => {
        it('should return an object HealthCheckResult"', async () => {
            mockHealthService.liveness.mockImplementationOnce(
                () =>
                    new Promise(resolve => {
                        resolve(
                            new FakeHealthCheckResult(
                                'ok',
                                testeUtils.getHealthIndicatorResult('up'),
                            ),
                        );
                    }),
            );

            const { status } = await healthController.liveness();

            expect(status).toBe('ok');
        });
    });
});
