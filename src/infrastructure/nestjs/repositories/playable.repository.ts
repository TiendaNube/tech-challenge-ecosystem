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
        startDate: Date,
        endDate: Date,
    ): Promise<PayableSummary> {
        const result = await this.payableRepository
            .createQueryBuilder()
            .select([
                'SUM(CASE WHEN payable.status = :paidStatus THEN payable.total ELSE 0 END) AS "totalPaid"',
                'SUM(DISTINCT payable.discount) AS "totalFees"',
                'SUM(CASE WHEN payable.status = :waitingStatus THEN payable.total ELSE 0 END) AS "upcomingPayments"',
            ])
            .from(PayableEntity, 'payable')
            .where(
                'payable.createdDate BETWEEN :startDate AND :endDate AND payable.merchantId = :merchantId',
                {
                    startDate,
                    endDate,
                    merchantId,
                    paidStatus: 'paid',
                    waitingStatus: 'waiting_funds',
                },
            )
            .getRawOne();

        return plainToInstance(PayableSummary, {
            totalPaid: parseFloat(result.totalPaid),
            totalFees: parseFloat(result.totalFees),
            upcomingPayments: parseFloat(result.upcomingPayments),
        });
    }
}
