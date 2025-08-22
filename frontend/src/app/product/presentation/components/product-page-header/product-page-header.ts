import { Component } from '@angular/core';
import { ProductSearchComponent } from '../product-search-component/product-search-component';
import { ProductService } from '@/app/product/application/services/product-service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-page-header',
  imports: [ProductSearchComponent],
  templateUrl: './product-page-header.html',
  styleUrl: './product-page-header.css',
})
export class ProductPageHeader {
  constructor(private productService: ProductService, private router: Router) {}
  onFilterChange(searchTerm: string): void {
    this.productService.changeFilter(searchTerm);
  }

  navigateToCreateProductPage(): void {
    this.router.navigateByUrl('/products/create');
  }
}
