import TransactionEntity from '@/app/transaction/domain/entities/transaction.entity';
import { Component } from '@angular/core';
import { TransactionTableBodyComponent } from '../transaction-table-body-component/transaction-table-body-component';
import { TransactionTableHeaderComponent } from '../transaction-table-header-component/transaction-table-header-component';
import { TransactionTablePagination } from '../transaction-table-pagination/transaction-table-pagination';
import {
  OptionTransactionClick,
  TransactionService,
} from '@/app/transaction/application/services/transaction-service';
import { TransactionTableSkeletonComponent } from '../transaction-table-skeleton-component/transaction-table-skeleton-component';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_TOTAL_ITEMS = 5;

@Component({
  selector: 'transaction-table-component',
  imports: [
    TransactionTableBodyComponent,
    TransactionTableHeaderComponent,
    TransactionTablePagination,
    TransactionTableSkeletonComponent,
  ],
  templateUrl: './transaction-table-component.html',
  styleUrl: './transaction-table-component.css',
})
export class TransactionTableComponent {
  constructor(private transactionService: TransactionService) {
    this.transactionService.transactions$.subscribe((transactions) => {
      console.log({ transactions });

      this.transactions = transactions.items;
      this.totalItems = transactions.pagination.totalCount;
      this.pageSize = transactions.pagination.pageSize;
      this.currentPage = transactions.pagination.page;
      this.totalPages = transactions.pagination.totalPages;
      this.hasNextPage = transactions.pagination.hasNextPage;
      this.hasPreviousPage = transactions.pagination.hasPreviousPage;

      this.thereAreNotTransactions = transactions.items.length === 0;
    });

    this.transactionService.isLoading$.subscribe((isLoading) => {
      this.isLoadingTransactions = isLoading;
    });
  }

  isLoadingTransactions = true;
  thereAreNotTransactions = false;

  transactions: TransactionEntity[] = [];
  totalItems: number = DEFAULT_TOTAL_ITEMS;
  pageSize: number = DEFAULT_PAGE_SIZE;
  currentPage: number = 1;
  totalPages: number = 1;
  hasNextPage: boolean = false;
  hasPreviousPage: boolean = false;

  options = [
    {
      label: 'Edit',
      operation: 'edit',
    },
    {
      label: 'Eliminar',
      operation: 'delete',
    },
  ];

  handleOptionClick(params: OptionTransactionClick) {
    this.transactionService.onOptionTransactionClick(params);
  }

  handlePageSizeChange(size: number) {
    this.transactionService.changePageSize(size);
  }

  handlePageChange(page: number) {
    this.transactionService.changePage(page);
  }
  handlePageNext() {
    this.transactionService.changePage(this.currentPage + 1);
  }
  handlePagePrevious() {
    this.transactionService.changePage(this.currentPage - 1);
  }
}
