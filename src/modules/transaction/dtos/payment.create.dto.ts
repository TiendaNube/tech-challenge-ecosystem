import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsPositive, IsString, Matches } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { IsValidExpirationDate } from '@/commons/utils/validation.utils';

/**
 * DTO para a criação de um pagamento.
 */
export class CreatePaymentDto {
    /**
     * O valor total do pagamento.
     * Deve ser um número positivo.
     */
    @IsPositive({ message: 'Total deve ser um número positivo' })
    @IsNumber({}, { message: 'Total deve ser um número' })
    total: number;

    /**
     * O ID do comerciante.
     * Deve ser um número.
     */
    @ApiProperty({ example: 123 })
    @IsNumber()
    merchantId: number;

    /**
     * A descrição da transação.
     * Deve ser uma string.
     */
    @ApiProperty({ example: 'Transaction description' })
    @IsString()
    description: string;

    /**
     * O método de pagamento.
     * Deve ser um valor enumerado válido de PaymentMethod.
     */
    @ApiProperty({ example: 'debit_card', enum: PaymentMethod })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    /**
     * O número do cartão.
     * Deve ser uma string composta exatamente por 4 dígitos.
     */
    @ApiProperty({ example: '1234' })
    @IsString({ message: 'Número do Cartão deve ser uma string' })
    @Matches(/^\d{4}$/, { message: 'Número do Cartão deve ter exatamente 4 dígitos' })
    cardNumber: string;

    /**
     * O nome do titular do cartão.
     * Deve ser uma string.
     */
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    cardHolder: string;

    /**
     * A data de expiração do cartão.
     * Deve ser uma string no formato MM/YYYY e representar uma data válida.
     */
    @ApiProperty({ example: '12/2023' })
    @IsString()
    @Matches(/^(0[1-9]|1[0-2])\/\d{4}$/, {
        message: 'A Data de Expiração do Cartão deve estar no formato MM/AAAA',
    })
    @IsValidExpirationDate()
    cardExpirationDate: string;

    /**
     * O código CVV do cartão.
     * Deve ser uma string composta exatamente por 3 dígitos.
     */
    @ApiProperty({ example: '123' })
    @IsString({ message: 'CVV do Cartão deve ser uma string' })
    @Matches(/^\d{3}$/, { message: 'CVV do Cartão deve ter exatamente 3 dígitos' })
    cardCVV: string;
}
