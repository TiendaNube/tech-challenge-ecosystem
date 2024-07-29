/**
 * Enumeração que define os status dos recebíveis.
 */
export enum PayablesStatus {
    /**
     * Recebível pago.
     */
    PAID = 'paid',

    /**
     * Recebível aguardando fundos.
     */
    WAITING_FUNDS = 'waiting_funds',
}
