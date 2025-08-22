import { ProductRepository } from '@/app/product/domain/repositories/product-repository';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, catchError, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import ProductEntity from '../../domain/entities/product.entity';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { ProductQuery } from '../../domain/value-objects/product-query';
import { ApiError } from '../errors/api-errors';
import { Result } from '@/app/core/domain/entities/result';
import { environment } from '@/enviroments/environment';

@Injectable()
class HttpProductRepository implements ProductRepository {
  private readonly baseUrl = `${environment.apiUrl}/product`;
  constructor(private readonly httpClient: HttpClient) {}

  findById(id: string): Observable<Result<ProductEntity>> {
    const url = new URL(`${this.baseUrl}/${id}`);
    return this.httpClient.get<Result<ProductEntity>>(url.toString()).pipe(
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

  search(query: ProductQuery): Observable<PaginatedResult<ProductEntity>> {
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
      .get<PaginatedResult<ProductEntity>>(url.toString())
      .pipe(
        map((response) => response),
        delay(1000),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  create(entity: Partial<ProductEntity>): Observable<Result<ProductEntity>> {
    return this.httpClient
      .post<Result<ProductEntity>>(this.baseUrl, entity)
      .pipe(
        map((response) => response),
        delay(1000),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  update(entity: Partial<ProductEntity>): Observable<Result<ProductEntity>> {
    const url = new URL(`${this.baseUrl}/${entity.id}`);
    return this.httpClient
      .put<Result<ProductEntity>>(url.toString(), entity)
      .pipe(
        map((response) => response),
        delay(1000),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  delete(id: string): Observable<Result<ProductEntity>> {
    const url = new URL(`${this.baseUrl}/${id}`);
    return this.httpClient.delete<Result<ProductEntity>>(url.toString()).pipe(
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

export default HttpProductRepository;
