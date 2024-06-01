import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CardMessageDTO } from './card.message.dto';
import { PaymentMethod, Transaction } from '../../../core/models/transaction';

export class TransactionMessageDTO {
  @IsString()
  public id: string;

  @IsNumber()
  public merchantId: number;

  @IsNumber()
  public amount: number;

  @IsString()
  public description: string;

  @IsString()
  public paymentMethod: string;

  @IsDateString()
  public createdAt: Date;

  @ValidateNested()
  @Type(() => CardMessageDTO)
  public card: CardMessageDTO;

  public toTransaction(): Transaction {
    return new Transaction(
      this.merchantId,
      this.description,
      PaymentMethod[this.paymentMethod],
      this.amount,
      this.card.toCard(),
      this.id,
      this.createdAt,
    );
  }
}
