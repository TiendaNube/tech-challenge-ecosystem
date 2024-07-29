import { Injectable } from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/types';
import { PostgreSqlTransactionsExpService } from '@/modules/postgresql/services/postgresql.transactions.service';
import { PaymentEntity } from '@/modules/postgresql/entities/payment.entity';
import { TransactionTransportDto } from '../dtos/transaction.transport.dto';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { CreateReceivableDto } from '../dtos/receivable.create.dto';
import { ReceivableEntity } from '@/modules/postgresql/entities/receivable.entity';

@Injectable()
export class TransactionExpService {
    /**
     * Construtor da classe TransactionExpService.
     * Injeta o mapeador e o serviço de transações do PostgreSQL.
     *
     * @param mapper - O mapeador injetado para conversão de DTOs para entidades.
     * @param postgreSqlTransactionsExpService - Serviço injetado para gerenciar transações no PostgreSQL.
     */
    constructor(
        @InjectMapper()
        protected readonly mapper: Mapper,
        private readonly postgreSqlTransactionsExpService: PostgreSqlTransactionsExpService,
    ) {}

    /**
     * Processa a transação recebida, mapeando DTOs para entidades e salvando-as dentro de uma transação.
     *
     * @param transactionTransportDto - O DTO contendo as informações da transação a ser processada.
     * @returns Uma Promise que resolve quando a transação é processada com sucesso ou rejeita em caso de erro.
     */
    async process(transactionTransportDto: TransactionTransportDto): Promise<void> {
        // Mapeia o DTO de pagamento para a entidade PaymentEntity
        const payment = this.mapper.map(transactionTransportDto.payment, PaymentEntity, CreatePaymentDto);

        // Mapeia o DTO de recebível para a entidade ReceivableEntity
        const receivable = this.mapper.map(
            transactionTransportDto.receivable,
            ReceivableEntity,
            CreateReceivableDto,
        );

        // Salva ambas as entidades em uma transação
        await this.postgreSqlTransactionsExpService.save(payment, receivable);
    }
}
