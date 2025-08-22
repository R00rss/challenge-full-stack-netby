import { Component } from '@angular/core';

const DEFAULT_SKELETON_COUNT = 6;
const NUMBER_OF_COLUMNS = 7;

@Component({
  selector: 'transaction-table-skeleton-component',
  templateUrl: './transaction-table-skeleton-component.html',
  styleUrl: './transaction-table-skeleton-component.css',
})
export class TransactionTableSkeletonComponent {
  skeletonTransactions: number[] = [];
  numberOfColumns: number[] = [];

  constructor() {
    this.skeletonTransactions = Array.from(
      { length: DEFAULT_SKELETON_COUNT },
      (_, index) => index + 1
    );
    this.numberOfColumns = Array.from(
      { length: NUMBER_OF_COLUMNS },
      (_, index) => index + 1
    );
  }
}
