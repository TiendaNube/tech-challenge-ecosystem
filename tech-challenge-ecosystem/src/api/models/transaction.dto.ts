import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CardDTO } from './card.dto';
import { Type } from 'class-transformer';
import { PaymentMethod, Transaction } from '../../core/models/transaction';

export class TransactionDTO {
  @IsNumber()
  public merchantId: number;

  @IsNumber()
  public amount: number;

  @IsString()
  public description: string;

  @IsString()
  public paymentMethod: string;

  @ValidateNested()
  @Type(() => CardDTO)
  public card: CardDTO;

  public toTransaction(): Transaction {
    return new Transaction(
      this.merchantId,
      this.description,
      PaymentMethod[this.paymentMethod],
      this.amount,
      this.card.toCard(),
    );
  }
}
