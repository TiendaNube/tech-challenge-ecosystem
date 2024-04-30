export interface IPaginationOptions extends IPaginationParams {
  total: number;
}

export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IPaginationOptionsProps {
  pagination: IPaginationParams;
}

export type InfinityPaginationResultType<T> = Readonly<{
  data: T[];
  metadata: {
    page: number;
    perPage: number;
    total: number;
  };
}>;
