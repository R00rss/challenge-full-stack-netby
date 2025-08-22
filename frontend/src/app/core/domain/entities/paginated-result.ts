import { Pagination } from '../value-objects/pagination';

export class PaginatedResult<T> {
  constructor(
    public readonly items: T[],
    public readonly pagination: Pagination
  ) {}
}
