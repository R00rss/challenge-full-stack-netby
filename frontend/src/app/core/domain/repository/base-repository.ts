// src/app/core/application/interfaces/base-repository.ts
import { Observable } from 'rxjs';
import { PaginatedResult } from '../entities/paginated-result';
import { Result } from '../entities/result';

export abstract class BaseRepository<TEntity, TId, TQuery> {
  abstract search(query: TQuery): Observable<PaginatedResult<TEntity>>;
  abstract findById(id: TId): Observable<Result<TEntity>>;
  abstract create(entity: Partial<TEntity>): Observable<Result<TEntity>>;
  abstract update(entity: Partial<TEntity>): Observable<Result<TEntity>>;
  abstract delete(id: TId): Observable<Result<TEntity>>;
}
