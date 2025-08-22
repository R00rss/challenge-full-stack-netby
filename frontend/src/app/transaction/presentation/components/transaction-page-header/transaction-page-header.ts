import { Component } from '@angular/core';
import { TransactionSearchComponent } from '../transaction-search-component/transaction-search-component';
import { TransactionService } from '@/app/transaction/application/services/transaction-service';
import { Router } from '@angular/router';

@Component({
  selector: 'transaction-page-header',
  imports: [TransactionSearchComponent],
  templateUrl: './transaction-page-header.html',
  styleUrl: './transaction-page-header.css',
})
export class TransactionPageHeader {
  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}
  onFilterChange(searchTerm: string): void {
    this.transactionService.changeFilter(searchTerm);
  }

  navigateToCreateTransactionPage(): void {
    this.router.navigateByUrl('/transactions/create');
  }
}
