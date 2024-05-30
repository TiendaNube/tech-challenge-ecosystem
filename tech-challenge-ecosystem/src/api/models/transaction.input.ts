import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { CardInput } from './card.input';
import { Type } from 'class-transformer';
import { Transaction } from '../../core/models/transaction';

export class TransactionInput {
  @IsNumber()
  public merchantId: number;

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
      this.paymentMethod,
      this.card.toCard(),
    );
  }
}
