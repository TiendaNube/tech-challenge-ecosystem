import { IPaginationOptions, InfinityPaginationResultType } from './types';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResultType<T> => {
  return {
    data,
    metadata: {
      perPage: options.limit,
      page: options.page,
      total: options.total,
    },
  };
};
