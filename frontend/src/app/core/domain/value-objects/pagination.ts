export class Pagination {
  constructor(
    public readonly page: number = 1,
    public readonly pageSize: number = 1,
    public readonly totalCount: number = 0,
    public readonly totalPages: number = 0,
    public readonly hasNextPage: boolean = false,
    public readonly hasPreviousPage: boolean = false
  ) {
    if (page < 1) throw new Error('Page must be >= 1');
    if (pageSize < 1) throw new Error('Page size must be >= 1');
  }

  get offset(): number {
    return (this.page - 1) * this.pageSize;
  }

  static create(page?: number, pageSize?: number): Pagination {
    return new Pagination(page, pageSize);
  }
}
