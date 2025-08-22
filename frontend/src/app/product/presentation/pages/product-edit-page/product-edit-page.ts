import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { ProductForm } from '../../components/product-form/product-form';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@/app/product/application/services/product-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import { CoreButtonBackComponent } from '@/app/core/presentation/components/core-button-back-component/core-button-back-component';

@Component({
  selector: 'product-edit-page',
  imports: [PageLayoutComponent, ProductForm, CoreButtonBackComponent],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.css',
})
export class ProductEditPage implements OnInit {
  selectedProductId: string = '';
  fondedProduct: ProductEntity | null = null;
  loadingProduct = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.validateEditMode();
  }

  validateEditMode(): void {
    this.selectedProductId = this.route.snapshot.paramMap.get('id') ?? '';
    this.productService.findById(this.selectedProductId).subscribe({
      next: (response) => {
        this.fondedProduct = response.data ?? null;
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Hubo un error al buscar el producto',
          type: NotificationType.Error,
        };
        this.errorMessage = 'Hubo un error al buscar el producto';
        this.notificationService.show(notificationOptions);
      },
      complete: () => {
        this.loadingProduct = false;
      },
    });
  }

  onSubmitForm(editedProduct: ProductEntity): void {
    this.productService.updateProduct(editedProduct);
  }
}
