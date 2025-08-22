import { ProductService } from '@/app/product/application/services/product-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import { Component } from '@angular/core';

@Component({
  selector: 'product-modal-delete',
  imports: [],
  templateUrl: './product-modal-delete.html',
  styleUrl: './product-modal-delete.css',
})
export class ProductModalDelete {
  product: ProductEntity | null = null;
  isOpen: boolean = false;

  constructor(private productService: ProductService) {
    this.productService.state$.subscribe((state) => {
      this.product = state.productToDelete;
      this.isOpen = state.isModalDeleteOpen;
    });
  }

  handleCancel() {
    this.productService.cancelModalDelete();
  }

  handleConfirm() {
    this.productService.confirmDeleteProduct();
  }
}
