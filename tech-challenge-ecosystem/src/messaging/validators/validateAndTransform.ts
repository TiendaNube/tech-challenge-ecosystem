import { validate } from 'class-validator';
import { plainToInstance, instanceToInstance } from 'class-transformer';

export type Newable<T> = { new (...args: any[]): T; };

export const validateAndTransform = async <T extends Object>(plainObject: any, cls: Newable<T>) => {
    const initialInstance = plainToInstance(cls, plainObject);
    const errors = await validate(initialInstance);
    if(errors.length) {
        // TODO: Improve error handling
        throw new Error(`VALIDATION ERROR ${JSON.stringify(errors)}`)
    }
    return initialInstance
}
