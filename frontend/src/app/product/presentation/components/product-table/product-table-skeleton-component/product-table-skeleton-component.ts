import { Component } from '@angular/core';

const DEFAULT_SKELETON_COUNT = 5;
const NUMBER_OF_COLUMNS = 6;

@Component({
  selector: 'product-table-skeleton-component',
  templateUrl: './product-table-skeleton-component.html',
  styleUrl: './product-table-skeleton-component.css',
})
export class ProductTableSkeletonComponent {
  skeletonProducts: number[] = [];
  numberOfColumns: number[] = [];

  constructor() {
    this.skeletonProducts = Array.from(
      { length: DEFAULT_SKELETON_COUNT },
      (_, index) => index + 1
    );
    this.numberOfColumns = Array.from(
      { length: NUMBER_OF_COLUMNS },
      (_, index) => index + 1
    );
  }
}
