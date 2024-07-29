import { IsValidExpirationDateConstraint } from './validation.utils';

describe('IsValidExpirationDateConstraint', () => {
    const constraint = new IsValidExpirationDateConstraint();

    it('should return false for invalid month', () => {
        expect(constraint.validate('13/2024')).toBe(false);
        expect(constraint.validate('00/2024')).toBe(false);
    });

    it('should return false for missing month or year', () => {
        expect(constraint.validate('/2024')).toBe(false);
        expect(constraint.validate('12/')).toBe(false);
    });

    it('should return false for non-numeric month or year', () => {
        expect(constraint.validate('AB/2024')).toBe(false);
        expect(constraint.validate('12/ABCD')).toBe(false);
    });

    it('should return true for valid dates', () => {
        expect(constraint.validate('01/2024')).toBe(true);
        expect(constraint.validate('12/2024')).toBe(true);
    });

    it('should return false for invalid date formats', () => {
        expect(constraint.validate('2024/12')).toBe(false);
        expect(constraint.validate('122024')).toBe(false);
        expect(constraint.validate('12-2024')).toBe(false);
    });

    it('should return default error message', () => {
        expect(constraint.defaultMessage()).toBe(
            'Card Expiration Date must be in MM/YYYY format and contain a valid month (01-12)',
        );
    });
});
