import ProductEntity from '@/app/product/domain/entities/product.entity';
import { Component } from '@angular/core';
import { ProductTableBodyComponent } from '../product-table-body-component/product-table-body-component';
import { ProductTableHeaderComponent } from '../product-table-header-component/product-table-header-component';
import { ProductTablePagination } from '../product-table-pagination/product-table-pagination';
import {
  OptionProductClick,
  ProductService,
} from '@/app/product/application/services/product-service';
import { ProductTableSkeletonComponent } from '../product-table-skeleton-component/product-table-skeleton-component';

const DEFAULT_PAGE_SIZE = 5;
const DEFAULT_TOTAL_ITEMS = 5;

@Component({
  selector: 'product-table-component',
  imports: [
    ProductTableBodyComponent,
    ProductTableHeaderComponent,
    ProductTablePagination,
    ProductTableSkeletonComponent,
  ],
  templateUrl: './product-table-component.html',
  styleUrl: './product-table-component.css',
})
export class ProductTableComponent {
  constructor(private productService: ProductService) {
    this.productService.products$.subscribe((products) => {
      console.log({ products });

      this.products = products.items;
      this.totalItems = products.pagination.totalCount;
      this.pageSize = products.pagination.pageSize;
      this.currentPage = products.pagination.page;
      this.totalPages = products.pagination.totalPages;
      this.hasNextPage = products.pagination.hasNextPage;
      this.hasPreviousPage = products.pagination.hasPreviousPage;

      this.thereAreNotProducts = products.items.length === 0;
    });

    this.productService.isLoading$.subscribe((isLoading) => {
      this.isLoadingProducts = isLoading;
    });
  }

  isLoadingProducts = true;
  thereAreNotProducts = false;

  products: ProductEntity[] = [];
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

  handleOptionClick(params: OptionProductClick) {
    this.productService.onOptionProductClick(params);
  }

  handlePageSizeChange(size: number) {
    this.productService.changePageSize(size);
  }

  handlePageChange(page: number) {
    this.productService.changePage(page);
  }
  handlePageNext() {
    this.productService.changePage(this.currentPage + 1);
  }
  handlePagePrevious() {
    this.productService.changePage(this.currentPage - 1);
  }
}
