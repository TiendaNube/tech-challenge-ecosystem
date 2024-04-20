import { Sequelize } from "sequelize";
import { PayableTotalSummaryType } from "../../../../domain/entities/payable";
import { FetchTotalPayablesByPeriodPort } from "../../../../domain/ports/outbound/database/fetch_total_payables_by_period_port";
import { PayableModel } from "../repository/payables";
import { DatabaseError } from "../../../../domain/errors/database_error";

export class FetchTotalPayablesByPeriodAdapter
  implements FetchTotalPayablesByPeriodPort
{
  /**
   * Fetch payables total summary for a merchant in a specific date range
   */
  async fetch(
    merchantId: number,
    startDate: Date,
    endDate: Date
  ): Promise<PayableTotalSummaryType> {
    const startDateAsString = startDate.toISOString().replace("Z", "");
    const endDateAsString = endDate.toISOString().replace("Z", "");

    const data = await PayableModel.findOne({
      attributes: [
        "merchant_id",
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              `CASE WHEN status = 'paid' and create_date between '${startDateAsString}' and '${endDateAsString}' THEN total ELSE 0 END`
            )
          ),
          "totalPaid",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              `CASE WHEN status = 'waiting_funds' and create_date between '${startDateAsString}' and '${endDateAsString}' THEN total ELSE 0 END`
            )
          ) as any,
          "totalPending",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              `CASE WHEN status = 'paid' and create_date between '${startDateAsString}' and '${endDateAsString}' THEN subtotal - total ELSE 0 END`
            )
          ) as any,
          "totalDiscountPaid",
        ],
      ],
      where: {
        merchantId: merchantId,
      },
      group: ["merchant_id"],
    });

    if (data == null || data.dataValues == undefined) {
      throw new DatabaseError(
        "database error: no merchant found with the id provided"
      );
    } else {
      return {
        totalPaid: data.dataValues.totalPaid,
        totalPending: data.dataValues.totalPending,
        totalDiscountPaid: data.dataValues.totalDiscountPaid,
      };
    }
  }
}
