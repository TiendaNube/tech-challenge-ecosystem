import Merchant from './Merchant';

export default interface IMerchantRepository {
  findById(id: number): Promise<Merchant | null>;
}
