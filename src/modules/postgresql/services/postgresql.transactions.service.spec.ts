import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryRunner, Repository, Connection } from 'typeorm';
import { PaymentEntity } from '@/modules/postgresql/entities/payment.entity';
import { ReceivableEntity } from '@/modules/postgresql/entities/receivable.entity';
import { PostgreSqlTransactionsExpService } from './postgresql.transactions.service';

describe('PostgreSqlTransactionsExpService', () => {
    let service: PostgreSqlTransactionsExpService;
    let paymentRepository: Repository<PaymentEntity>;
    let receivableRepository: Repository<ReceivableEntity>;
    let queryRunner: QueryRunner;
    let connection: Connection;

    beforeEach(async () => {
        queryRunner = {
            connect: jest.fn(),
            startTransaction: jest.fn(),
            manager: {
                save: jest.fn(),
            },
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            release: jest.fn(),
        } as unknown as QueryRunner;

        connection = {
            createQueryRunner: jest.fn().mockReturnValue(queryRunner),
        } as unknown as Connection;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PostgreSqlTransactionsExpService,
                {
                    provide: getRepositoryToken(PaymentEntity),
                    useValue: {
                        manager: { connection },
                    },
                },
                {
                    provide: getRepositoryToken(ReceivableEntity),
                    useValue: {},
                },
                {
                    provide: Connection,
                    useValue: connection,
                },
            ],
        }).compile();

        service = module.get<PostgreSqlTransactionsExpService>(PostgreSqlTransactionsExpService);
        paymentRepository = module.get<Repository<PaymentEntity>>(getRepositoryToken(PaymentEntity));
        receivableRepository = module.get<Repository<ReceivableEntity>>(getRepositoryToken(ReceivableEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('save', () => {
        it('should save payment and receivable within a transaction', async () => {
            const payment = new PaymentEntity();
            const receivable = new ReceivableEntity();

            await service.save(payment, receivable);

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.manager.save).toHaveBeenCalledWith(PaymentEntity, payment);
            expect(queryRunner.manager.save).toHaveBeenCalledWith(ReceivableEntity, receivable);
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });

        it('should rollback the transaction in case of an error', async () => {
            const payment = new PaymentEntity();
            const receivable = new ReceivableEntity();

            (queryRunner.manager.save as jest.Mock).mockRejectedValueOnce(new Error('Error saving'));

            await expect(service.save(payment, receivable)).rejects.toThrow('Error saving');

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });
    });
});
