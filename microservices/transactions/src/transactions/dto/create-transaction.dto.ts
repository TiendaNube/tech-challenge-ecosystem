import {
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PaymentMethodEnum } from '../entities/transaction.entity';
import { CreateCardDto } from './create-card.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @ApiProperty({
    example: 'T-Shirt Black M',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: PaymentMethodEnum.CREDIT_CARD,
  })
  @IsEnum(PaymentMethodEnum)
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @ApiProperty({ example: 45.2 })
  @IsNotEmpty()
  @IsNumber()
  totalValue: number;

  @ApiProperty({ type: CreateCardDto })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateCardDto)
  card: CreateCardDto;
}
