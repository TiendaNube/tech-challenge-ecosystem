import { CreatePayableDto } from 'src/payables/dto/create-payable.dto';
import { PayableStatusEnum } from 'src/payables/entities/payable.entity';

export interface AbstractPayable {
  setSubTotal: (payable: CreatePayableDto) => number;
  setTotal: (payable: CreatePayableDto) => number;
  setDiscount(payable: CreatePayableDto): number;
  setTransactionAt(): Date;
  setStatus(): PayableStatusEnum;
}
