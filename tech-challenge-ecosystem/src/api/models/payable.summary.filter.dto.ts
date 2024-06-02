import { IsDateString, IsString } from 'class-validator';

export class PayableSummaryFilterDTO {
  @IsString()
  public merchantId: string;

  @IsDateString()
  public startDate: string;

  @IsDateString()
  public endDate: string;
}
