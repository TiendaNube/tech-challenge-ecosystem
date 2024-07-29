import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { HomeService } from '../services/home.service';

/**
 * Controlador responsável por lidar com as requisições à rota principal da aplicação.
 */
@Controller()
export class HomeController {
    constructor(private readonly homeService: HomeService) {}

    /**
     * Endpoint principal que retorna uma mensagem de boas-vindas.
     *
     * @returns Uma mensagem de boas-vindas.
     */
    @Get()
    @ApiExcludeEndpoint()
    getHello(): string {
        return this.homeService.getHello();
    }
}
