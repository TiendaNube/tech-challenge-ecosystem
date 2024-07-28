import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsPositive } from 'class-validator';

import { ReceivableStatus } from '../enums/receivable-status';

export class CreateReceivableDto {
    constructor(partial: Partial<CreateReceivableDto>) {
        Object.assign(this, partial);
    }

    @ApiProperty({ example: 123 })
    @IsNumber()
    merchantId: number;

    @ApiProperty({ example: 'paid', enum: ReceivableStatus })
    @IsEnum(ReceivableStatus)
    status: ReceivableStatus;

    @IsDateString({}, { message: 'Create Date must be a valid date' })
    createDate: string;

    @IsPositive({ message: 'Subtotal must be a positive number' })
    @IsNumber({}, { message: 'Subtotal must be a number' })
    subtotal: number;

    @IsPositive({ message: 'Discount must be a positive number' })
    @IsNumber({}, { message: 'Discount must be a number' })
    discount: number;

    @IsPositive({ message: 'Total must be a positive number' })
    @IsNumber({}, { message: 'Total must be a number' })
    total: number;
}
