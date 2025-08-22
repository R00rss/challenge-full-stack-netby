import TransactionEntity from '../entities/transaction.entity';
import { Injectable } from '@angular/core';
import { BaseRepository } from '@/app/core/domain/repository/base-repository';
import { TransactionQuery } from '../value-objects/transaction-query';
import { Result } from '@/app/core/domain/entities/result';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export abstract class TransactionRepository extends BaseRepository<
  TransactionEntity,
  string,
  TransactionQuery
> {
  abstract isStockEnough(
    productId: string,
    stock: number
  ): Observable<Result<boolean>>;
}
