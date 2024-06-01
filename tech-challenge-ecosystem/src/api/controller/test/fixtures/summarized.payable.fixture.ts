import { PayableStatus } from "../../../../core/models/payable";
import { SummarizedPayables } from "../../../../core/models/summarized.payables";

export class SummarizedPayablesFixture {
    public static default() {
        return new SummarizedPayables(
            PayableStatus.PAID,
            98,
            100,
            2
        )
    }
}