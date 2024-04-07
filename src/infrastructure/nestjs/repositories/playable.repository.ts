import { PayableSummary } from '@domain/entities/payable-summary.entity';
import { IPayableRepository } from '@domain/interfaces/payable.repository';
import { Repository } from 'typeorm';
import { PayableEntity } from '../database/entities/payable.entity';
import { plainToInstance } from 'class-transformer';

export class PayableRepositoryImpl implements IPayableRepository {
    constructor(
        private readonly payableRepository: Repository<PayableEntity>,
    ) {}

    async summaryByMerchantIdAndStartDateAndEndDate(
        merchantId: string,
        startDate?: Date,
        endDate?: Date,
    ): Promise<PayableSummary> {
        const queryBuilder = this.payableRepository.createQueryBuilder();
        if (startDate && endDate) {
            // Use BETWEEN when both startDate and endDate are provided
            queryBuilder.andWhere(
                'payable.createdDate BETWEEN :startDate AND :endDate',
                {
                    startDate,
                    endDate,
                },
            );
        } else {
            // Use individual conditions when only one of startDate or endDate is provided
            if (startDate) {
                queryBuilder.andWhere('payable.createdDate >= :startDate', {
                    startDate,
                });
            }
            if (endDate) {
                queryBuilder.andWhere('payable.createdDate <= :endDate', {
                    endDate,
                });
            }
        }

        const result = await queryBuilder
            .andWhere('payable.merchantId = :merchantId', { merchantId })
            .select([
                'SUM(DISTINCT CASE WHEN payable.status = :paidStatus THEN payable.total ELSE 0 END) AS "totalPaid"',
                'SUM(DISTINCT payable.discount) AS "totalFees"',
                'SUM(DISTINCT CASE WHEN payable.status = :waitingStatus THEN payable.total ELSE 0 END) AS "upcomingPayments"',
            ])
            .from(PayableEntity, 'payable')
            .setParameter('paidStatus', 'paid')
            .setParameter('waitingStatus', 'waiting_funds')
            .getRawOne();

        return plainToInstance(PayableSummary, {
            totalPaid: parseFloat(result.totalPaid),
            totalFees: parseFloat(result.totalFees),
            upcomingPayments: parseFloat(result.upcomingPayments),
        });
    }
}
