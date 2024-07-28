import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvironmentEnum } from '@commons/enums/environment.enum';

function setupSwagger(app: NestFastifyApplication, envCfg: string): void {
    if ([EnvironmentEnum.DEV, EnvironmentEnum.HML].includes(envCfg as EnvironmentEnum)) {
        const config = new DocumentBuilder()
            .setTitle('Tech Challenge Ecosystem')
            .setDescription('Test Case Nuvemshop')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('swagger', app, document);
    }
}

function setupGlobalPipes(app: NestFastifyApplication): void {
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        }),
    );
}

function setupCors(app: NestFastifyApplication): void {
    app.enableCors({
        origin: '*',
        methods: 'GET,POST,HEAD,OPTIONS',
        allowedHeaders: '*',
        maxAge: 86400,
        exposedHeaders: ['Content-Type'],
    });
}

function setupGlobalPrefix(app: NestFastifyApplication): void {
    app.setGlobalPrefix('api', {
        exclude: [
            { path: '/', method: RequestMethod.GET },
            { path: '/health', method: RequestMethod.GET },
            { path: '/health/readiness', method: RequestMethod.GET },
            { path: '/health/liveness', method: RequestMethod.GET },
        ],
    });
}

function setupVersioning(app: NestFastifyApplication): void {
    app.enableVersioning({
        type: VersioningType.URI,
    });
}

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    const configService = app.get(ConfigService);
    const envCfg = configService.get<string>('NODE_ENV');
    const portCfg = configService.get<number>('NODE_DOCKER_PORT');

    setupGlobalPrefix(app);
    setupVersioning(app);
    setupGlobalPipes(app);
    setupSwagger(app, envCfg);
    setupCors(app);

    await app.listen(portCfg, '0.0.0.0');
}
bootstrap();
