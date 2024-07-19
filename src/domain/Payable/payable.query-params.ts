import { IsDateString, IsDefined, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class PayableQueryParams {
  @IsDefined()
  @IsInt()
  @Type(() => Number)
    merchantId: number

  @IsDefined()
  @IsDateString()
    fromDate: Date

  @IsDefined()
  @IsDateString()
    toDate: Date
}
