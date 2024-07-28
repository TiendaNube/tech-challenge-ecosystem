import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Length, Matches, Max, Min } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { IsValidExpirationDate } from '@/commons/utils/validation.utils';

export class CreatePaymentDto {
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
    @IsNumber()
    @Min(1000, { message: 'Card Number must be exactly 4 digits' })
    @Max(9999, { message: 'Card Number must be exactly 4 digits' })
    cardNumber: number;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    cardHolder: string;

    @ApiProperty({ example: '12/2023' })
    @IsString()
    @Matches(/^(0[1-9]|1[0-2])\/\d{4}$/, { message: 'Card Expiration Date must be in MM/YYYY format' })
    @IsValidExpirationDate()
    cardExpirationDate: string;

    @ApiProperty({ example: 123 })
    @IsNumber()
    @Min(100, { message: 'Card CVV must be exactly 3 digits' })
    @Max(999, { message: 'Card CVV must be exactly 3 digits' })
    cardCVV: number;
}
