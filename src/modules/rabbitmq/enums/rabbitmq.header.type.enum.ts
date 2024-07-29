/**
 * Enumeração que define os tipos de cabeçalhos usados no RabbitMQ.
 */
export enum RabbitMQHeaderType {
    /**
     * Tipo de cabeçalho usado para testes.
     */
    TEST = 'test',

    /**
     * Tipo de cabeçalho usado para transações.
     */
    TRANSACTION = 'transaction',
}
