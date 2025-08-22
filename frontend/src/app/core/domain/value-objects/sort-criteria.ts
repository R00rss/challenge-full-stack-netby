export class SortCriteria<T = any> {
  constructor(
    public readonly field: keyof T,
    public readonly direction: 'asc' | 'desc' = 'asc'
  ) {}

  static create<T>(
    field: keyof T,
    direction: 'asc' | 'desc' = 'asc'
  ): SortCriteria<T> {
    return new SortCriteria(field, direction);
  }
}
