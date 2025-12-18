export interface ResponseApi {
  responseCode: string;
  responseMessage: string;
  errors?: Error[];
}

export type ErrorApi = {
  fieldName: string[];
};

export interface TableParams {
  page: number;
  perPage: number;
  sort: Sort[];
  startDate: string | null;
  endDate: string | null;
  searchBy: string;
  searchQuery?: string;
  shouldExport?: number;
  transactionType?: string;
  type?: string;
}

export type Sort = {
  by: string;
  direction: "desc" | "asc";
};

export type SortParams = {
  id: string;
  desc: boolean;
};

export interface TableResponseApi<T> extends ResponseApi {
  items: T[];
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
}

export interface ListResponseApi<T> extends ResponseApi {
  items: T[];
}
