import { TransformFnParams } from 'class-transformer/types/interfaces';

export const toNumberTransformer = (params: TransformFnParams): string =>
  String(params?.value || '')?.replace(/[^0-9]/g, '');
