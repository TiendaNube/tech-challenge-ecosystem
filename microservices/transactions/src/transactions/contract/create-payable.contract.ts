import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaymentMethodEnum } from '../entities/transaction.entity';

export class CreatePayableContract {
  @IsNotEmpty()
  merchantId: string;

  @ApiProperty({ example: 45.2 })
  @IsNotEmpty()
  @IsNumber()
  totalValue: number;

  @ApiProperty({
    example: PaymentMethodEnum.CREDIT_CARD,
  })
  @IsEnum(PaymentMethodEnum)
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({
    example: 'John Smith',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  cardHolder: string;

  @ApiProperty({
    example: '4338',
  })
  @IsNotEmpty()
  @IsNumberString()
  cardNumber: string;

  @ApiProperty({
    example: '12/2028',
  })
  @IsNotEmpty()
  @IsString()
  cardExpirationDate: string;

  @ApiProperty({
    example: '233',
    type: String,
  })
  @MaxLength(3)
  @MinLength(2)
  @IsNumberString()
  @IsNotEmpty()
  cardCvv: string;
}
