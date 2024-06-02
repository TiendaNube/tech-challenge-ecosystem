import { IsString, MinLength } from 'class-validator';
import { Card } from '../../core/models/card';

export const CARD_NUMBER_MIN_LENGTH = 4;

export class CardDTO {
  @IsString()
  @MinLength(CARD_NUMBER_MIN_LENGTH)
  public number: string;

  @IsString()
  public holder: string;

  @IsString()
  public expirationDate: string;

  @IsString()
  public cvv: string;

  public toCard(): Card {
    const lastFourCardNumberDigits = this.number.slice(
      this.number.length - CARD_NUMBER_MIN_LENGTH,
    );

    return new Card(
      lastFourCardNumberDigits,
      this.holder,
      this.expirationDate,
      this.cvv,
    );
  }
}
