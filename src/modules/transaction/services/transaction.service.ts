import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { RabbitMQProducerService } from '@modules/rabbitmq/services/rabbitmq.producer.services';
import { RabbitMQHeaderType } from '@/modules/rabbitmq/enums/rabbitmq.header.type.enum';
import { CreateReceivableDto } from '../dtos/receivable.create.dto';
import { PaymentMethod } from '../enums/payment-method.enum';
import { ReceivableStatus } from '../enums/receivable-status.enum';
import { addDays, format } from 'date-fns';

/**
 * Serviço responsável pelo processamento de transações e criação de recebíveis.
 */
@Injectable()
export class TransactionService {
    private readonly FEE_DEBIT: number = 2;
    private readonly FEE_CREDIT: number = 4;
    private readonly DPLUS_DEBIT: number = 0;
    private readonly DPLUS_CREDIT: number = 30;

    constructor(private readonly rabbitMQProducerService: RabbitMQProducerService) {}

    /**
     * Processa uma transação de pagamento.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados do pagamento a ser processado.
     * @returns Uma promessa que resolve para `true` se a mensagem foi enviada com sucesso para o RabbitMQ, caso contrário `false`.
     */
    async process(createPaymentDto: CreatePaymentDto): Promise<boolean> {
        console.log(this.createReceivable(createPaymentDto));

        return this.rabbitMQProducerService.sendMessage<CreatePaymentDto>(
            createPaymentDto,
            RabbitMQHeaderType.TRANSACTION,
        );
    }

    /**
     * Cria um recebível com base nos dados do pagamento.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados do pagamento.
     * @returns Um objeto `CreateReceivableDto` representando o recebível criado.
     */
    private createReceivable(createPaymentDto: CreatePaymentDto): CreateReceivableDto {
        return createPaymentDto.paymentMethod === PaymentMethod.DEBIT_CARD
            ? this.createReceivableForDebit(createPaymentDto)
            : this.createReceivableForCredit(createPaymentDto);
    }

    /**
     * Cria um recebível para um pagamento via cartão de débito.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados do pagamento.
     * @returns Um objeto `CreateReceivableDto` representando o recebível criado.
     */
    private createReceivableForDebit(createPaymentDto: CreatePaymentDto): CreateReceivableDto {
        const { discount, total } = this.calculateProcessingFee(createPaymentDto.total, this.FEE_DEBIT);
        return new CreateReceivableDto({
            merchantId: createPaymentDto.merchantId,
            status: ReceivableStatus.PAID,
            createDate: this.getDate(this.DPLUS_DEBIT),
            subtotal: createPaymentDto.total,
            discount,
            total,
        });
    }

    /**
     * Cria um recebível para um pagamento via cartão de crédito.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados do pagamento.
     * @returns Um objeto `CreateReceivableDto` representando o recebível criado.
     */
    private createReceivableForCredit(createPaymentDto: CreatePaymentDto): CreateReceivableDto {
        const { discount, total } = this.calculateProcessingFee(createPaymentDto.total, this.FEE_CREDIT);
        return new CreateReceivableDto({
            merchantId: createPaymentDto.merchantId,
            status: ReceivableStatus.PAID,
            createDate: this.getDate(this.DPLUS_CREDIT),
            subtotal: createPaymentDto.total,
            discount,
            total,
        });
    }

    /**
     * Calcula a data com base no número de dias adicionados à data atual.
     *
     * @param daysPlus - Número de dias a serem adicionados à data atual.
     * @returns Uma string representando a nova data no formato 'yyyy-MM-dd'.
     */
    private getDate(daysPlus: number): string {
        const currentDate = new Date();
        const newDate = addDays(currentDate, daysPlus);
        return format(newDate, 'yyyy-MM-dd');
    }

    /**
     * Calcula a taxa de processamento para um valor de pagamento.
     *
     * @param value - Valor do pagamento.
     * @param fee - Taxa de processamento em porcentagem.
     * @returns Um objeto contendo o desconto calculado e o valor total após o desconto.
     */
    private calculateProcessingFee(value: number, fee: number): { discount: number; total: number } {
        const result = value * (fee / 100);
        const discount = Math.round(result * 100) / 100;
        const total = value - discount;

        return { discount, total };
    }
}
