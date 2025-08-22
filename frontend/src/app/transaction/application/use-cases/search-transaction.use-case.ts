import { Injectable } from '@angular/core';
import { TransactionRepository } from '../../domain/repositories/transaction-repository';
import { TransactionQuery } from '../../domain/value-objects/transaction-query';

@Injectable()
export class SearchTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(query: TransactionQuery) {
    return this.transactionRepository.search(query);
  }
}
