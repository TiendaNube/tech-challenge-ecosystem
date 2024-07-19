import {
  IsDateString,
  IsDefined,
  IsIn,
  IsInt,
  IsNumber,
  IsString, MaxLength,
  MinLength
} from 'class-validator'
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
  @MinLength(4)
  @MaxLength(4)
    cardNumber: string

  @IsDefined()
  @IsString()
    cardHolder: string

  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
    value: number

  @IsDefined()
  @IsDateString({ strict: false, strictSeparator: false })
    cardExpirationDate: Date

  @IsDefined()
  @IsInt()
    cardCVV: number
}
