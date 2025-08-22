import { SortDirection } from '../enums/sort-direction';

export abstract class BaseQuery<TEntity> {
  constructor(
    public page?: number,
    public pageSize?: number,
    public sortColumn?: keyof TEntity,
    public sortDirection?: SortDirection,
    public searchTerm?: string
  ) {
    this.page = this.page ?? 1;
    this.pageSize = this.pageSize ?? 1;
    this.sortColumn = this.sortColumn;
    this.sortDirection = this.sortDirection ?? SortDirection.DESC;
    this.searchTerm = this.searchTerm ?? '';
  }
}
