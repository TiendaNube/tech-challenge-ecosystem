import { Injectable } from '@nestjs/common';

/**
 * Serviço responsável por fornecer mensagens de boas-vindas.
 */
@Injectable()
export class HomeService {
    /**
     * Retorna uma mensagem de boas-vindas.
     *
     * @returns Uma mensagem de boas-vindas.
     */
    getHello(): string {
        return '[Tech Challange Ecosystem]';
    }
}
