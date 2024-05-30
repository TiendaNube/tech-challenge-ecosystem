import { Type } from "class-transformer"
import { IsNumber, IsString, ValidateNested } from "class-validator"
import { CardMessageDTO } from "./card.message.dto"
import { Transaction } from "src/core/models/transaction"

export class TransactionMessageDTO {
    @IsString()
    public id: string

    @IsNumber()
    public merchantId: number

    @IsString()
    public description: string

    @IsString()
    public paymentMethod: string

    @ValidateNested()
    @Type(() => CardMessageDTO)
    public card: CardMessageDTO

    public toTransaction(): Transaction {
        return new Transaction(
            this.merchantId, 
            this.description,
            this.paymentMethod,
            this.card.toCard(),
            this.id
        )
    }
}