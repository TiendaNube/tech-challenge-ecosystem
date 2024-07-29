import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';
import {
    HealthCheckService,
    HealthCheckResult,
    HealthIndicatorResult,
    HealthCheckError,
    HttpHealthIndicator,
    TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

describe('HealthService', () => {
    let healthService: HealthService;
    let healthCheckService: HealthCheckService;
    let httpHealthIndicator: HttpHealthIndicator;
    let configService: ConfigService;
    let amqpConnection: AmqpConnection;
    let postgresqlHealth: TypeOrmHealthIndicator;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HealthService,
                {
                    provide: HealthCheckService,
                    useValue: {
                        check: jest.fn(),
                    },
                },
                {
                    provide: HttpHealthIndicator,
                    useValue: {
                        pingCheck: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => {
                            switch (key) {
                                case 'NODE_DOCKER_HOST':
                                    return 'localhost';
                                case 'NODE_DOCKER_PORT':
                                    return 3000;
                                default:
                                    return null;
                            }
                        }),
                    },
                },
                {
                    provide: AmqpConnection,
                    useValue: {
                        managedConnection: {
                            createChannel: jest.fn(),
                        },
                    },
                },
                {
                    provide: TypeOrmHealthIndicator,
                    useValue: {
                        pingCheck: jest.fn(),
                    },
                },
            ],
        }).compile();

        healthService = module.get<HealthService>(HealthService);
        healthCheckService = module.get<HealthCheckService>(HealthCheckService);
        httpHealthIndicator = module.get<HttpHealthIndicator>(HttpHealthIndicator);
        configService = module.get<ConfigService>(ConfigService);
        amqpConnection = module.get<AmqpConnection>(AmqpConnection);
        postgresqlHealth = module.get<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
    });

    it('should be defined', () => {
        expect(healthService).toBeDefined();
    });

    describe('getUrl', () => {
        it('should return the correct URL', () => {
            const url = healthService.getUrl();
            expect(url).toBe('http://localhost:3000');
        });
    });

    describe('readiness', () => {
        it('should return the readiness check result', async () => {
            const result: HealthCheckResult = { status: 'ok', info: {}, error: {}, details: {} };
            const pingCheckResult: HealthIndicatorResult = { Self: { status: 'up' } };
            const rabbitCheckResult: HealthIndicatorResult = { rabbitmq: { status: 'up' } };
            const postgresCheckResult: HealthIndicatorResult = { PostgreSQL: { status: 'up' } };

            jest.spyOn(healthCheckService, 'check').mockResolvedValue(result);
            jest.spyOn(httpHealthIndicator, 'pingCheck').mockResolvedValue(pingCheckResult);
            jest.spyOn(healthService as any, 'isRabbitMQHealthy').mockResolvedValue(rabbitCheckResult);
            jest.spyOn(postgresqlHealth, 'pingCheck').mockResolvedValue(postgresCheckResult);

            expect(await healthService.readiness()).toBe(result);
            expect(healthCheckService.check).toHaveBeenCalledWith([
                expect.any(Function),
                expect.any(Function),
                expect.any(Function),
            ]);
        });
    });

    describe('liveness', () => {
        it('should return the liveness check result', async () => {
            const result: HealthCheckResult = { status: 'ok', info: {}, error: {}, details: {} };
            const pingCheckResult: HealthIndicatorResult = { Self: { status: 'up' } };

            jest.spyOn(healthCheckService, 'check').mockResolvedValue(result);
            jest.spyOn(httpHealthIndicator, 'pingCheck').mockResolvedValue(pingCheckResult);

            expect(await healthService.liveness()).toBe(result);
            expect(healthCheckService.check).toHaveBeenCalledWith([expect.any(Function)]);
        });
    });

    describe('isRabbitMQHealthy', () => {
        it('should return rabbitmq status up', async () => {
            const result = { rabbitmq: { status: 'up' } };
            jest.spyOn(amqpConnection.managedConnection, 'createChannel').mockImplementation(() => {});

            expect(await healthService['isRabbitMQHealthy']()).toEqual(result);
        });

        it('should throw HealthCheckError if RabbitMQ is down', async () => {
            const error = new Error('Connection failed');
            jest.spyOn(amqpConnection.managedConnection, 'createChannel').mockImplementation(() => {
                throw error;
            });

            await expect(healthService['isRabbitMQHealthy']()).rejects.toThrow(HealthCheckError);
        });
    });
});
