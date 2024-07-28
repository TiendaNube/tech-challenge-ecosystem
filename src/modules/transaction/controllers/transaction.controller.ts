import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from '../dtos/payment.create.dto';

@Controller('transaction')
export class TransactionServiceController {
    @ApiTags('Transactions')
    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    @ApiBody({ type: CreatePaymentDto })
    async post(@Body() createPaymentDto: CreatePaymentDto): Promise<void> {
        console.log(createPaymentDto);
    }
}
