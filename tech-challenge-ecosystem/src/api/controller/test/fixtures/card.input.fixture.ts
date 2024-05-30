import { CardInput } from '../../../models/card.input';

export class CardInputFixture {
  public static default(): CardInput {
    const cardInput = new CardInput();
    cardInput.number = '1234567898754321';
    cardInput.holder = 'John Smith';
    cardInput.expirationDate = '12/2028';
    cardInput.cvv = '012';
    return cardInput;
  }
}
