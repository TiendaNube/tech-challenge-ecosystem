import { IsDateString, IsDecimal, IsDefined, IsIn, IsInt, IsISO8601, IsNumber, IsString } from 'class-validator'
import { PaymentMethod } from './transaction'

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
  @IsString()
    cardNumber: string

  @IsDefined()
  @IsString()
    cardHolder: string

  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
    value: number

  @IsDateString({ strict: false, strictSeparator: false })
    cardExpirationDate: Date

  @IsDefined()
  @IsInt()
    cardCVV: number
}
