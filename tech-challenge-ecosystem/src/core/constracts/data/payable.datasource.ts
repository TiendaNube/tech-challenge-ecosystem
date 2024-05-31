import { Payable } from 'src/core/models/payable';

export const PAYABLE_DATASOURCE_PROVIDE = 'PAYABLE_DATASOURCE_PROVIDE';

export interface PayableDatasource {
  create(payable: Payable): Promise<Payable>;
}
