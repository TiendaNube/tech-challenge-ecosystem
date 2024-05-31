import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CardInput } from './card.input';
import { Type } from 'class-transformer';
import { PaymentMethod, Transaction } from '../../core/models/transaction';

export class TransactionInput {
  @IsNumber()
  public merchantId: number;

  @IsNumber()
  public amount: number;

  @IsString()
  public description: string;

  // TODO: Use an ENUM
  @IsString()
  public paymentMethod: string;

  @ValidateNested()
  @Type(() => CardInput)
  public card: CardInput;

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
