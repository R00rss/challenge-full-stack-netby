import { Inject, Injectable } from '@angular/core';
import { TransactionRepository } from '../../domain/repositories/transaction-repository';

@Injectable()
export class FindByIdTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  execute(transactionId: string) {
    return this.transactionRepository.findById(transactionId);
  }
}
