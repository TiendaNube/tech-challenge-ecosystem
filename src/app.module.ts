import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigEnv } from '@commons/config-module.env';
import { HomeModule } from '@modules/home/home.module';
import { HealthModule } from '@modules/health/health.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: ConfigEnv,
        }),
        HomeModule,
        HealthModule,
    ],
})
export class AppModule {}
