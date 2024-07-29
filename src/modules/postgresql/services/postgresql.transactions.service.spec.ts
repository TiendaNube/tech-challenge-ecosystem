import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryRunner, Repository, Connection } from 'typeorm';
import { PaymentEntity } from '@/modules/postgresql/entities/payment.entity';
import { PayablesEntity } from '@/modules/postgresql/entities/payable.entity';
import { PostgreSqlTransactionsExpService } from './postgresql.transactions.service';

describe('PostgreSqlTransactionsExpService', () => {
    let service: PostgreSqlTransactionsExpService;
    let paymentRepository: Repository<PaymentEntity>;
    let payablesRepository: Repository<PayablesEntity>;
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
                    provide: getRepositoryToken(PayablesEntity),
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
        payablesRepository = module.get<Repository<PayablesEntity>>(getRepositoryToken(PayablesEntity));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('save', () => {
        it('should save payment and payables within a transaction', async () => {
            const payment = new PaymentEntity();
            const payables = new PayablesEntity();

            await service.save(payment, payables);

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.manager.save).toHaveBeenCalledWith(PaymentEntity, payment);
            expect(queryRunner.manager.save).toHaveBeenCalledWith(PayablesEntity, payables);
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });

        it('should rollback the transaction in case of an error', async () => {
            const payment = new PaymentEntity();
            const payables = new PayablesEntity();

            (queryRunner.manager.save as jest.Mock).mockRejectedValueOnce(new Error('Error saving'));

            await expect(service.save(payment, payables)).rejects.toThrow('Error saving');

            expect(queryRunner.connect).toHaveBeenCalled();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
        });
    });
});
