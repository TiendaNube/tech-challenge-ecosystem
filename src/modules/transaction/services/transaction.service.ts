import { Injectable } from '@nestjs/common';
import { addDays, format } from 'date-fns';
import { RabbitMQProducerService } from '@modules/rabbitmq/services/rabbitmq.producer.services';
import { RabbitMQHeaderType } from '@/modules/rabbitmq/enums/rabbitmq.header.type.enum';
import { PostgreSqlTransactionsExpService } from '@/modules/postgresql/services/postgresql.transactions.service';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { CreatePayablesDto } from '../dtos/payables.create.dto';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PayablesStatus } from '../enums/payables-status.enum';
import { TransactionTransportDto } from '../dtos/transaction.transport.dto';
import { PayablesTotalDto } from '../dtos/payables.total.dto';

/**
 * Serviço responsável pelo processamento de transações e criação de recebíveis.
 */
@Injectable()
export class TransactionService {
    private readonly FEE_DEBIT: number = 2;
    private readonly FEE_CREDIT: number = 4;
    private readonly DPLUS_DEBIT: number = 0;
    private readonly DPLUS_CREDIT: number = 30;

    constructor(
        private readonly rabbitMQProducerService: RabbitMQProducerService,
        private readonly postgreSqlTransactionsExpService: PostgreSqlTransactionsExpService,
    ) {}

    /**
     * Processa uma transação de pagamento.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados do pagamento a ser processado.
     * @returns Uma promessa que resolve para `true` se a mensagem foi enviada com sucesso para o RabbitMQ, caso contrário `false`.
     */
    async process(createPaymentDto: CreatePaymentDto): Promise<boolean> {
        return this.rabbitMQProducerService.sendMessage<TransactionTransportDto>(
            {
                payment: createPaymentDto,
                payables: this.createPayables(createPaymentDto),
            },
            RabbitMQHeaderType.TRANSACTION,
        );
    }

    /**
     * Calcula o total de recebíveis (payables) de um comerciante em um período de datas informado.
     *
     * @param merchantId - ID do comerciante.
     * @param startDate - Data de início do período.
     * @param endDate - Data de término do período.
     * @returns Um objeto `PayablesTotalDto` contendo os totais calculados de recebíveis pagos, descontos e valores futuros.
     */
    async calculatePayabless(merchantId: number, startDate: Date, endDate: Date): Promise<PayablesTotalDto> {
        const [paidPayabless, waitingFundsPayabless] = await Promise.all([
            this.postgreSqlTransactionsExpService.getPayabless(
                merchantId,
                startDate,
                endDate,
                PayablesStatus.PAID,
            ),
            this.postgreSqlTransactionsExpService.getPayabless(
                merchantId,
                startDate,
                endDate,
                PayablesStatus.WAITING_FUNDS,
            ),
        ]);

        const totalPaid = paidPayabless.reduce((sum, payables) => sum + payables.total, 0);
        const totalDiscounts = paidPayabless.reduce((sum, payables) => sum + payables.discount, 0);
        const totalWaitingFunds = waitingFundsPayabless.reduce((sum, payables) => sum + payables.total, 0);
        return new PayablesTotalDto({
            totalPaid,
            totalDiscounts,
            totalWaitingFunds,
        });
    }

    /**
     * Cria um recebível com base nos dados do pagamento.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados do pagamento.
     * @returns Um objeto `CreatePayablesDto` representando o recebível criado.
     */
    private createPayables(createPaymentDto: CreatePaymentDto): CreatePayablesDto {
        return createPaymentDto.paymentMethod === PaymentMethod.DEBIT_CARD
            ? this.createPayablesForDebit(createPaymentDto)
            : this.createPayablesForCredit(createPaymentDto);
    }

    /**
     * Cria um recebível para um pagamento via cartão de débito.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados do pagamento.
     * @returns Um objeto `CreatePayablesDto` representando o recebível criado.
     */
    private createPayablesForDebit(createPaymentDto: CreatePaymentDto): CreatePayablesDto {
        const { discount, total } = this.calculateProcessingFee(createPaymentDto.total, this.FEE_DEBIT);
        return new CreatePayablesDto({
            merchantId: createPaymentDto.merchantId,
            status: PayablesStatus.PAID,
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
     * @returns Um objeto `CreatePayablesDto` representando o recebível criado.
     */
    private createPayablesForCredit(createPaymentDto: CreatePaymentDto): CreatePayablesDto {
        const { discount, total } = this.calculateProcessingFee(createPaymentDto.total, this.FEE_CREDIT);
        return new CreatePayablesDto({
            merchantId: createPaymentDto.merchantId,
            status: PayablesStatus.WAITING_FUNDS,
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
