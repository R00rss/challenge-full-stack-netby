import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'transaction-table-pagination',
  imports: [],
  templateUrl: './transaction-table-pagination.html',
  styleUrl: './transaction-table-pagination.css',
})
export class TransactionTablePagination {
  @Input() totalItems!: number;
  @Input() pageSize!: number;

  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Input() hasNextPage!: boolean;
  @Input() hasPreviousPage!: boolean;

  @Output() onPageSizeChange = new EventEmitter<number>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onPageNext = new EventEmitter<void>();
  @Output() onPagePrevious = new EventEmitter<void>();

  isDropdownOpen = false;
  pageSizeOptions = [1, 5, 10, 20, 50, 100];
  maxVisiblePages = 5; // Número máximo de páginas a mostrar

  handlePageSizeChange(size: number): void {
    this.pageSize = size;
    this.isDropdownOpen = false;
    this.onPageSizeChange.emit(size);
  }

  handlePageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.onPageChange.emit(page);
    }
  }

  handlePreviousPage(): void {
    if (this.hasPreviousPage) {
      this.onPagePrevious.emit();
    }
  }

  handleNextPage(): void {
    if (this.hasNextPage) {
      this.onPageNext.emit();
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  // Genera el array de páginas a mostrar
  get visiblePages(): number[] {
    if (this.totalPages <= this.maxVisiblePages) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(this.maxVisiblePages / 2);
    let start = this.currentPage - half;
    let end = this.currentPage + half;

    if (start < 1) {
      start = 1;
      end = this.maxVisiblePages;
    }

    if (end > this.totalPages) {
      end = this.totalPages;
      start = this.totalPages - this.maxVisiblePages + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  get shouldShowFirstPage(): boolean {
    return this.totalPages > this.maxVisiblePages && this.visiblePages[0] > 1;
  }

  get shouldShowLastPage(): boolean {
    return (
      this.totalPages > this.maxVisiblePages &&
      this.visiblePages[this.visiblePages.length - 1] < this.totalPages
    );
  }

  get shouldShowFirstEllipsis(): boolean {
    return this.shouldShowFirstPage && this.visiblePages[0] > 2;
  }

  get shouldShowLastEllipsis(): boolean {
    return (
      this.shouldShowLastPage &&
      this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1
    );
  }
}
