import { Injectable } from "@nestjs/common";
import { PaymentMethod, Transaction } from "../../models/transaction";
import * as  dayjs from 'dayjs'
import { PayableStatus, Payable } from "../../models/payable";

@Injectable()
export class PayableFromTransactionBusiness {
    public generatePayableProperties(paymentMethod: PaymentMethod) {
        const mapper = {
            [PaymentMethod.CREDIT_CARD]: {
                payableStatus: PayableStatus.WAITING_FUNDS,
                fee: 0.04,
                creationDateAddition: 30,
            },
            [PaymentMethod.DEBIT_CARD]: {
                payableStatus: PayableStatus.PAID,
                fee: 0.02,
                creationDateAddition: 0,
            }
        }

        return mapper[paymentMethod]
    }

    public createPayable(transaction: Transaction): Payable {
        const properties = this.generatePayableProperties(transaction.paymentMethod)
        const discount = transaction.amount * properties.fee 

        return new Payable(
            transaction.merchantId,
            properties.payableStatus,
            dayjs(transaction.createdAt).add(properties.creationDateAddition, "days").toDate(),
            discount,
            transaction.amount - discount,
            transaction.amount,
            transaction
        )
    }
}