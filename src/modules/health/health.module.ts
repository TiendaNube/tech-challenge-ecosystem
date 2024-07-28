import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { HealthService } from './services/health.service';
import { CustomRabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
    imports: [TerminusModule, HttpModule, CustomRabbitMQModule],
    controllers: [HealthController],
    providers: [HealthService],
})
export class HealthModule {}
