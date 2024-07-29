import { Mapper, MappingProfile, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { PaymentEntity } from '@/modules/postgresql/entities/payment.entity';
import { ReceivableEntity } from '@/modules/postgresql/entities/receivable.entity';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { CreateReceivableDto } from '../dtos/receivable.create.dto';

@Injectable()
export class TransactionProfile extends AutomapperProfile {
    /**
     * Construtor da classe TransactionProfile.
     * Inicializa o mapeador injetado pelo NestJS.
     *
     * @param mapper - O mapeador injetado para configuração dos perfis de mapeamento.
     */
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    /**
     * Define o perfil de mapeamento para as entidades e DTOs.
     *
     * @returns O perfil de mapeamento configurado.
     */
    get profile(): MappingProfile {
        return mapper => {
            // Mapeamento de PaymentEntity para CreatePaymentDto
            createMap(mapper, PaymentEntity, CreatePaymentDto);

            // Mapeamento de ReceivableEntity para CreateReceivableDto
            createMap(mapper, ReceivableEntity, CreateReceivableDto);
        };
    }
}
