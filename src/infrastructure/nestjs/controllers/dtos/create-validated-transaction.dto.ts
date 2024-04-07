import { TransactionPaymentMethod } from '@domain/entities/transaction.entity';
import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
} from 'class-validator';

export class CreateValidatedTransactionDto {
    @IsNotEmpty()
    @IsNumber()
    readonly totalValue: number;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    @Length(4, 4)
    readonly cardNumber: string;

    @IsNotEmpty()
    @IsString()
    readonly cardHolder: string;

    @IsNotEmpty()
    @IsDateString()
    readonly cardExpirationDate: Date;

    @IsNotEmpty()
    @IsEnum(TransactionPaymentMethod)
    paymentMethod: TransactionPaymentMethod;

    @IsString()
    @Length(3, 3)
    readonly cardCvv: string;

    @IsNotEmpty()
    @IsString()
    readonly merchantId: string;
}
