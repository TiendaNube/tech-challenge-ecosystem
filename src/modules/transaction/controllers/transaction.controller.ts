import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { TransactionService } from '../services/transaction.service';
import { isValid, parse } from 'date-fns';
import { PayablesTotalDto } from '../dtos/payables.total.dto';

/**
 * Controlador responsável por lidar com as transações.
 */
@ApiTags('Transactions')
@Controller('transaction')
export class TransactionServiceController {
    constructor(private readonly transactionService: TransactionService) {}

    /**
     * Endpoint para criar uma nova transação.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados da transação a ser criada.
     */
    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiBody({ type: CreatePaymentDto })
    async postTransaction(@Body() createPaymentDto: CreatePaymentDto): Promise<void> {
        await this.transactionService.process(createPaymentDto);
    }

    /**
     * Endpoint para calcular o total de recebíveis (payables) de um comerciante
     * em um período de datas informado.
     *
     * @param merchantId - ID do comerciante.
     * @param startDate - Data de início no formato dd/MM/yyyy.
     * @param endDate - Data de término no formato dd/MM/yyyy.
     * @returns Um objeto contendo os totais calculados de recebíveis pagos, descontos e valores futuros.
     */
    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: 200,
        description: 'The calculated payables total',
        type: PayablesTotalDto,
    })
    async calculatePayabless(
        @Query('merchantId') merchantId: number,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ): Promise<PayablesTotalDto> {
        const start = parse(startDate, 'dd/MM/yyyy', new Date());
        const end = parse(endDate, 'dd/MM/yyyy', new Date());

        // Verifica se as datas são válidas
        if (!isValid(start) || !isValid(end)) {
            throw new BadRequestException('Invalid date format. Please use dd/MM/yyyy.');
        }

        // Chama o serviço para calcular os recebíveis
        return this.transactionService.calculatePayabless(merchantId, start, end);
    }
}
