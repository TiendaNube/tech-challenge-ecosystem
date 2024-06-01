import { Card } from '../../card';

export class CardFixture {
  public static default() {
    return new Card('9876', 'John Smith', '12/2028', '012');
  }
}
