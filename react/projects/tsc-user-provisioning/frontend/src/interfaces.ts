export interface IError {
  [key: string]: string;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IResponseBody<T> {
  data: T;
}

export interface IResponseBodyWithPagination<T> extends IResponseBody<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
