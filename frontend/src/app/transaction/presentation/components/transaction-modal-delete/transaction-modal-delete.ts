import { TransactionService } from '@/app/transaction/application/services/transaction-service';
import TransactionEntity from '@/app/transaction/domain/entities/transaction.entity';
import { Component } from '@angular/core';

@Component({
  selector: 'transaction-modal-delete',
  imports: [],
  templateUrl: './transaction-modal-delete.html',
  styleUrl: './transaction-modal-delete.css',
})
export class TransactionModalDelete {
  transaction: TransactionEntity | null = null;
  isOpen: boolean = false;

  constructor(private transactionService: TransactionService) {
    this.transactionService.state$.subscribe((state) => {
      this.transaction = state.transactionToDelete;
      this.isOpen = state.isModalDeleteOpen;
    });
  }

  handleCancel() {
    this.transactionService.cancelModalDelete();
  }

  handleConfirm() {
    this.transactionService.confirmDeleteTransaction();
  }
}
