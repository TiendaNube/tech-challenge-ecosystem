import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    constructor() {}

    @Get()
    getServerInfo(): string {
        return 'Server is running!';
    }
}
