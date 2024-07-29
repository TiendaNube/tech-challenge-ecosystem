import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreatePaymentDto } from './payment.create.dto';
import { CreatePayablesDto } from './payable.create.dto';

/**
 * DTO para a criação de uma transação, combinando dados de pagamento e recebível.
 */
export class TransactionTransportDto {
    /**
     * Os dados do pagamento.
     * Contém informações detalhadas sobre o pagamento, como total, método de pagamento e detalhes do cartão.
     */
    @ApiProperty({ type: CreatePaymentDto })
    @ValidateNested()
    @Type(() => CreatePaymentDto)
    payment: CreatePaymentDto;

    /**
     * Os dados do recebível.
     * Inclui informações sobre o recebível, como ID do comerciante, status, data de criação e valores financeiros.
     */
    @ApiProperty({ type: CreatePayablesDto })
    @ValidateNested()
    @Type(() => CreatePayablesDto)
    payables: CreatePayablesDto;
}
