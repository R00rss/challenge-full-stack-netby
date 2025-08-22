import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { ProductTableComponent } from '../../components/product-table/product-table-component/product-table-component';
import { ProductModalDelete } from '../../components/product-modal-delete/product-modal-delete';
import { ProductService } from '@/app/product/application/services/product-service';
import { ProductPageHeader } from '../../components/product-page-header/product-page-header';
import { CoreButtonBackComponent } from '@/app/core/presentation/components/core-button-back-component/core-button-back-component';

@Component({
  selector: 'app-product-page',
  imports: [
    ProductTableComponent,
    PageLayoutComponent,
    ProductModalDelete,
    ProductPageHeader,
    CoreButtonBackComponent,
  ],
  templateUrl: './product-page.html',
  styleUrl: './product-page.css',
})
export class ProductPage implements OnInit {
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.loadProducts();
    this.productService.state$.subscribe((state) => {
      console.log({ state });
      console.log(state.isLoading);
    });
  }
}
