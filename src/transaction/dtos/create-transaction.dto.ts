import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export enum PaymentMethod {
  DebitCard = 'debit_card',
  CreditCard = 'credit_card',
}

export class CreateTransactionDto {
  @ApiProperty({ type: Number, description: 'Total value of the transaction' })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: 'Total value of the transaction must be numeric' },
  )
  totalValue: number;

  @ApiProperty({ type: String, description: 'Description of the transaction' })
  @IsNotEmpty({ message: 'Description of the transaction is required' })
  @IsString({ message: 'Description of the transaction must be a string' })
  description: string;

  @ApiProperty({
    enum: ['debit_card', 'credit_card'],
    description: 'Payment method: debit_card or credit_card',
  })
  @IsNotEmpty({ message: 'Payment method is required' })
  @IsEnum(PaymentMethod, {
    message: 'Payment method must be "debit_card" or "credit_card"',
  })
  paymentMethod: 'debit_card' | 'credit_card';

  @ApiProperty({ type: String, description: 'Last 4 digits of the card' })
  @IsNotEmpty({ message: 'Last 4 digits of the card are required' })
  @IsString({ message: 'Last 4 digits of the card must be a string' })
  @Length(4, 4, {
    message: 'Last 4 digits of the card must be exactly 4 characters',
  })
  cardLastDigits: string;

  @ApiProperty({ type: String, description: 'Name of the card holder' })
  @IsNotEmpty({ message: 'Card holder name is required' })
  @IsString({ message: 'Card holder name must be a string' })
  cardHolderName: string;

  @ApiProperty({ type: Date, description: 'Card expiration date' })
  @IsNotEmpty({ message: 'Card expiration date is required' })
  expirationDate: Date;

  @ApiProperty({ type: String, description: 'CVV of the card' })
  @IsNotEmpty({ message: 'Card CVV is required' })
  @IsString({ message: 'Card CVV must be a string' })
  @Length(3, 3, { message: 'Card CVV must be exactly 3 characters' })
  cvv: string;

  @ApiProperty({ type: String, description: 'ID of the merchant' })
  @IsNotEmpty({ message: 'Merchant ID is required' })
  @IsString({ message: 'Merchant ID must be a string' })
  merchantId: string;
}
