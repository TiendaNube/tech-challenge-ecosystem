import { IsString } from "class-validator"
import { Card } from "../../core/models/card"

export class CardMessageDTO {
    @IsString()
    public number: string

    @IsString()
    public holder: string

    @IsString()
    public expirationDate: string

    @IsString()
    public cvv: string

    public toCard(): Card {
        return new Card(
            this.number,
            this.holder,
            this.expirationDate,
            this.cvv
        )
    }
}