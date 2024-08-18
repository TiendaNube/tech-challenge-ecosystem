import Merchant from './Merchant';

export enum PaymentMethod {
  DEBIT_CARD = 'debit_card',
  CREDIT_CARD = 'credit_card',
}

export default interface Transaction {
  id?: number;
  description: string;
  payment_method: string;
  card_number: string;
  card_holder: string;
  cvv: string;
  expiration_date: Date;
  created_at: Date | null;
  merchant_id: number;
  total: number;
  merchant: Merchant;
}
