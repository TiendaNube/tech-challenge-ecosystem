import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { TransactionService } from '../services/transaction.service';

/**
 * Controlador responsável por lidar com as transações.
 */
@Controller('transaction')
export class TransactionServiceController {
    constructor(private readonly transactionService: TransactionService) {}

    /**
     * Endpoint para criar uma nova transação.
     *
     * @param createPaymentDto - Objeto DTO contendo os dados da transação a ser criada.
     */
    @ApiTags('Transactions')
    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiBody({ type: CreatePaymentDto })
    async post(@Body() createPaymentDto: CreatePaymentDto): Promise<void> {
        await this.transactionService.process(createPaymentDto);
    }
}
