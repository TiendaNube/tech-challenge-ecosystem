import { CardInput } from "./CardInput"

export class TransactionInput {
    public merchantId: string
    public description: string
    // TODO: Use an ENUM
    public paymentMethod: string
    public cardNumber: number
    public card: CardInput
}