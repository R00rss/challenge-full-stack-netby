import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import TransactionEntity from '../../domain/entities/transaction.entity';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { TransactionQuery } from '../../domain/value-objects/transaction-query';
import { ApiError } from '../errors/api-errors';
import { Result } from '@/app/core/domain/entities/result';
import { environment } from '@/enviroments/environment';
import { TransactionRepository } from '../../domain/repositories/transaction-repository';

@Injectable()
class HttpTransactionRepository implements TransactionRepository {
  private readonly baseUrl = `${environment.apiUrl}/transaction`;
  constructor(private readonly httpClient: HttpClient) {}

  findById(id: string): Observable<Result<TransactionEntity>> {
    const url = new URL(`${this.baseUrl}/${id}`);
    return this.httpClient.get<Result<TransactionEntity>>(url.toString()).pipe(
      map((response) => response),
      delay(1000),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  isStockEnough(productId: string, stock: number): Observable<Result<boolean>> {
    const url = new URL(`${this.baseUrl}/isStockEnough`);

    url.searchParams.append('productId', productId);
    url.searchParams.append('stock', stock.toString());

    return this.httpClient.get<Result<boolean>>(url.toString()).pipe(
      map((response) => response),
      delay(1000),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  search(
    query: TransactionQuery
  ): Observable<PaginatedResult<TransactionEntity>> {
    const url = new URL(`${this.baseUrl}/search`);

    query.page && url.searchParams.append('page', query.page.toString());
    query.pageSize &&
      url.searchParams.append('pageSize', query.pageSize.toString());
    query.sortColumn &&
      url.searchParams.append('sortColumn', query.sortColumn.toString());
    query.sortDirection &&
      url.searchParams.append('sortDirection', query.sortDirection);
    query.searchTerm && url.searchParams.append('searchTerm', query.searchTerm);

    return this.httpClient
      .get<PaginatedResult<TransactionEntity>>(url.toString())
      .pipe(
        map((response) => response),
        delay(1000),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  create(
    entity: Partial<TransactionEntity>
  ): Observable<Result<TransactionEntity>> {
    return this.httpClient
      .post<Result<TransactionEntity>>(this.baseUrl, entity)
      .pipe(
        map((response) => response),
        delay(1000),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  update(
    entity: Partial<TransactionEntity>
  ): Observable<Result<TransactionEntity>> {
    const url = new URL(`${this.baseUrl}/${entity.id}`);
    return this.httpClient
      .put<Result<TransactionEntity>>(url.toString(), entity)
      .pipe(
        map((response) => response),
        delay(1000),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  delete(id: string): Observable<Result<TransactionEntity>> {
    const url = new URL(`${this.baseUrl}/${id}`);
    return this.httpClient
      .delete<Result<TransactionEntity>>(url.toString())
      .pipe(
        map((response) => response),
        delay(1000),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  handleError(error: HttpErrorResponse): Observable<never> {
    const apiError = ApiError.fromResponse(error, error.status);
    return throwError(() => apiError);
  }
}

export default HttpTransactionRepository;
