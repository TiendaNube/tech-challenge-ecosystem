import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { ReceivableStatus } from '../enums/receivable-status.enum';

/**
 * DTO para a criação de um recebível.
 */
export class CreateReceivableDto {
    /**
     * Construtor da classe CreateReceivableDto.
     *
     * @param partial - Objeto parcial para inicializar as propriedades do DTO.
     */
    constructor(partial: Partial<CreateReceivableDto>) {
        Object.assign(this, partial);
    }

    /**
     * O ID do comerciante.
     * Deve ser um número.
     */
    @ApiProperty({ example: 123 })
    @IsNumber()
    merchantId: number;

    /**
     * O status do recebível.
     * Deve ser um valor enumerado válido de ReceivableStatus.
     */
    @ApiProperty({ example: 'paid', enum: ReceivableStatus })
    @IsEnum(ReceivableStatus)
    status: ReceivableStatus;

    /**
     * A data de criação do recebível.
     * Deve ser uma string de data válida.
     */
    @IsDateString({}, { message: 'Create Date deve ser uma data válida' })
    createDate: string;

    /**
     * O subtotal do recebível.
     * Deve ser um número positivo.
     */
    @IsPositive({ message: 'Subtotal deve ser um número positivo' })
    @IsNumber({}, { message: 'Subtotal deve ser um número' })
    subtotal: number;

    /**
     * O desconto aplicado ao recebível.
     * Deve ser um número positivo.
     */
    @IsPositive({ message: 'Discount deve ser um número positivo' })
    @IsNumber({}, { message: 'Discount deve ser um número' })
    discount: number;

    /**
     * O total do recebível.
     * Deve ser um número positivo.
     */
    @IsPositive({ message: 'Total deve ser um número positivo' })
    @IsNumber({}, { message: 'Total deve ser um número' })
    total: number;
}
