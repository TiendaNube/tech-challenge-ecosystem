import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';
import { CustomRabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { PostgreSqlModule } from '@modules/postgresql/postgresl.module';

@Module({
    imports: [TerminusModule, HttpModule, CustomRabbitMQModule, PostgreSqlModule],
    controllers: [HealthController],
    providers: [HealthService],
})
export class HealthModule {}
