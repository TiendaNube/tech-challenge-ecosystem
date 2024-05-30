import { Card } from "./Card"

export class Transaction {
    public merchantId: string
    public description: string
    // TODO: Use an ENUM
    public paymentMethod: string
    public cardNumber: number
    public card: Card
}