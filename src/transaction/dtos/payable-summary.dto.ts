import { ApiProperty } from '@nestjs/swagger';

export class PayableSummaryDTO {
  @ApiProperty({ example: '1000.00' })
  totalPaid: string;

  @ApiProperty({ example: '50.00' })
  totalFees: string;

  @ApiProperty({ example: '950.00' })
  futureFunds: string;
}
