import { Injectable } from '@nestjs/common';
import { PaymentEntity } from '@/modules/postgresql/entities/payment.entity';
import { PayablesEntity } from '@/modules/postgresql/entities/payables.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';

@Injectable()
export class PostgreSqlTransactionsExpService {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentRepository: Repository<PaymentEntity>,
        @InjectRepository(PayablesEntity)
        private readonly payablesRepository: Repository<PayablesEntity>,
    ) {}

    /**
     * Processa e salva as entidades PaymentEntity e PayablesEntity dentro de uma transação.
     * Se ocorrer um erro durante o salvamento de qualquer uma das entidades, a transação é revertida.
     *
     * @param payment - A entidade PaymentEntity a ser salva.
     * @param payables - A entidade PayablesEntity a ser salva.
     * @returns Uma Promise que resolve quando ambas as entidades são salvas com sucesso ou rejeita em caso de erro.
     */
    async save(payment: PaymentEntity, payables: PayablesEntity): Promise<void> {
        const queryRunner = this.paymentRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Salva a entidade PaymentEntity
            await queryRunner.manager.save(PaymentEntity, payment);

            // Salva a entidade PayablesEntity
            await queryRunner.manager.save(PayablesEntity, payables);

            // Confirma a transação
            await queryRunner.commitTransaction();
        } catch (error) {
            // Reverte a transação em caso de erro
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Libera o QueryRunner
            await queryRunner.release();
        }
    }
}
