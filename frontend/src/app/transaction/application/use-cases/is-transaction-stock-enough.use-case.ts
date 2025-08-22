import { Injectable } from '@angular/core';
import { TransactionRepository } from '../../domain/repositories/transaction-repository';

@Injectable()
export class IsTransactionStockEnoughUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(productId: string, stock: number) {
    return this.transactionRepository.isStockEnough(productId, stock);
  }
}
