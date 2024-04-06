enum PayableStatus {
    'paid',
    'waiting_funds',
}
export class Payable {
    id: string;
    merchantId: string;
    status: PayableStatus;
    subTotal: number;
    discount: number;
    total: number;
    createdDate: Date;
}
