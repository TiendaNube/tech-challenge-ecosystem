import * as Joi from 'joi';

export const ConfigEnv = Joi.object({
    NODE_ENV: Joi.string().required(),
    NODE_DOCKER_PORT: Joi.number().default(3002),
    NODE_DOCKER_HOST: Joi.string().default('localhost'),
});
