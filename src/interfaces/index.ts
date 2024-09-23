export type Pagination = {
    limit: number;
    offset: number;
    page: number;
    total: number;
    pages: number;
};
  
export type PaginationResponse<T> = {
    data: T[];
    meta: Pagination;
};

export interface Services {
    [key: string]: Service;
}
  
export interface Process {
    name: string;
    services: Services;
    init(): void;
    start(): void;
    stop(): void;
}
export interface Service {
    name: string;
    parent: Process;
    init(): void;
    start(): void;
    stop(): void;
}
  