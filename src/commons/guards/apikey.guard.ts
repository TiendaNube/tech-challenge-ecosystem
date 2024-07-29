import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private reflector: Reflector,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        try {
            const request = context.switchToHttp().getRequest<Request>();
            const apiKey = request.headers['x-api-key'];

            if (this.isValidApiKey(apiKey)) {
                return true;
            } else {
                throw new UnauthorizedException('Invalid API key');
            }
        } catch (e) {
            throw new UnauthorizedException('Invalid API key');
        }
    }

    private isValidApiKey(apiKey: string | string[]): boolean {
        const validApiKey = this.configService.get<string>('API_KEY');
        return apiKey === validApiKey;
    }
}
