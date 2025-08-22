import { Injectable } from '@angular/core';
import { TransactionRepository } from '../../domain/repositories/transaction-repository';
import TransactionEntity from '../../domain/entities/transaction.entity';

@Injectable()
export class EditTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}
  execute(transaction: TransactionEntity) {
    return this.transactionRepository.update(transaction);
  }
}
