import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Validação personalizada para verificar se a data de expiração está no formato MM/YYYY
 * e contém um mês válido (01-12).
 */
@ValidatorConstraint({ async: false })
export class IsValidExpirationDateConstraint implements ValidatorConstraintInterface {
    /**
     * Valida se a string de data fornecida está no formato MM/YYYY e possui um mês válido.
     * @param date - A string de data a ser validada.
     * @returns `true` se a data for válida, caso contrário `false`.
     */
    validate(date: string) {
        const [month, year] = date.split('/').map(Number);

        if (!month || !year || month < 1 || month > 12) {
            return false;
        }
        return true;
    }

    /*
     * Mensagem de erro padrão para a validação.
     * @returns Uma mensagem de string indicando o erro de validação.
     */
    defaultMessage() {
        return 'Card Expiration Date must be in MM/YYYY format and contain a valid month (01-12)';
    }
}

/**
 * Decorador personalizado para validar se uma propriedade é uma data de expiração válida no formato MM/YYYY.
 * @param validationOptions - Opções de validação opcionais.
 * @returns Uma função de decorador de propriedade.
 */
export function IsValidExpirationDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsValidExpirationDateConstraint,
        });
    };
}
