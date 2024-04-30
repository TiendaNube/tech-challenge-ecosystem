import { ApiProperty } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentMethodEnum {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

export class CreateTransactionDto {
  @ApiProperty({
    example: 'T-Shirt Black M',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 200,
  })
  @IsNumber()
  @IsNotEmpty()
  totalValue: number;

  @ApiProperty({
    example: PaymentMethodEnum.CREDIT_CARD,
  })
  @IsEnum(PaymentMethodEnum)
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({ type: CreateCardDto })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateCardDto)
  card: CreateCardDto;
}
