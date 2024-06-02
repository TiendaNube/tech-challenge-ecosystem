import { CardDTO } from '../../../models/card.dto';

export class CardDTOFixture {
  public static default(): CardDTO {
    const cardInput = new CardDTO();
    cardInput.number = '1234567898754321';
    cardInput.holder = 'John Smith';
    cardInput.expirationDate = '12/2028';
    cardInput.cvv = '012';
    return cardInput;
  }
}
