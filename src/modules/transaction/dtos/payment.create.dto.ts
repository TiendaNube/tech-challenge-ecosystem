import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsString, Matches } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { IsValidExpirationDate } from '@/commons/utils/validation.utils';

export class CreatePaymentDto {
    @IsPositive({ message: 'Total must be a positive number' })
    @IsNumber({}, { message: 'Total must be a number' })
    total: number;

    @ApiProperty({ example: 123 })
    @IsNumber()
    merchantId: number;

    @ApiProperty({ example: 'Transaction description' })
    @IsString()
    description: string;

    @ApiProperty({ example: 'debit_card', enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @ApiProperty({ example: '1234' })
    @IsString({ message: 'Card Number must be a string' })
    @Matches(/^\d{4}$/, { message: 'Card Number must be exactly 4 digits' })
    cardNumber: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    cardHolder: string;

    @ApiProperty({ example: '12/2023' })
    @IsString()
    @Matches(/^(0[1-9]|1[0-2])\/\d{4}$/, { message: 'Card Expiration Date must be in MM/YYYY format' })
    @IsValidExpirationDate()
    cardExpirationDate: string;

    @ApiProperty({ example: '123' })
    @IsString({ message: 'Card CVV must be a string' })
    @Matches(/^\d{3}$/, { message: 'Card CVV must be exactly 3 digits' })
    cardCVV: string;
}
