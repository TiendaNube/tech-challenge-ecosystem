import {IsDefined, IsIn, IsInt, IsISO8601, IsString} from "class-validator";
import {PaymentMethod} from "./Transaction";

export class TransactionDTO {
  @IsDefined()
  @IsInt()
  merchantId: number

  @IsDefined()
  @IsString()
  description: string

  @IsDefined()
  @IsIn(Object.values(PaymentMethod))
  paymentMethod: PaymentMethod

  @IsDefined()
  @IsInt()
  cardNumber: number

  @IsDefined()
  @IsString()
  cardHolder: string

  @IsDefined()
  @IsISO8601()
  cardExpirationDate: Date

  @IsDefined()
  @IsInt()
  cardCVV: number
}