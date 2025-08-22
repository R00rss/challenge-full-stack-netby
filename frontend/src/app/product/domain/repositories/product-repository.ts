import ProductEntity from '../entities/product.entity';
import { Injectable } from '@angular/core';
import { BaseRepository } from '@/app/core/domain/repository/base-repository';
import { ProductQuery } from '../value-objects/product-query';
import { Result } from '@/app/core/domain/entities/result';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class ProductRepository extends BaseRepository<
  ProductEntity,
  string,
  ProductQuery
> {
  abstract isStockEnough(
    productId: string,
    stock: number
  ): Observable<Result<boolean>>;
}
