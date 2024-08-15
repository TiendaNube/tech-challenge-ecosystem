export default interface Payable {
  id: number;
  merchant_id: number;
  status: string;
  create_date: Date;
  discount: number;
  subtotal: number;
  total: number;
}

export interface GroupedPayable {
  status: string;
  subtotal: number;
  discount: number;
}
