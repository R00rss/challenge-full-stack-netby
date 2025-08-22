import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { TransactionForm } from '../../components/transaction-form/transaction-form';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from '@/app/transaction/application/services/transaction-service';
import TransactionEntity from '@/app/transaction/domain/entities/transaction.entity';
import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import { CoreButtonBackComponent } from '@/app/core/presentation/components/core-button-back-component/core-button-back-component';
import { ProductQuery } from '@/app/product/domain/value-objects/product-query';
import { ProductService } from '@/app/product/application/services/product-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';

@Component({
  selector: 'transaction-edit-page',
  imports: [PageLayoutComponent, TransactionForm, CoreButtonBackComponent],
  templateUrl: './transaction-edit-page.html',
  styleUrl: './transaction-edit-page.css',
})
export class TransactionEditPage implements OnInit {
  selectedTransactionId: string = '';
  fondedTransaction: TransactionEntity | null = null;
  loadingTransaction = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionService: TransactionService,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService
  ) {}
  products: ProductEntity[] = [];

  ngOnInit(): void {
    this.validateEditMode();

    const productQuery = new ProductQuery(
      1,
      10000000,
      undefined,
      undefined,
      undefined
    );

    this.productService.loadProducts(productQuery);
    this.productService.products$.subscribe((products) => {
      this.products = products.items;
    });
  }

  validateEditMode(): void {
    this.selectedTransactionId = this.route.snapshot.paramMap.get('id') ?? '';
    this.transactionService.findById(this.selectedTransactionId).subscribe({
      next: (response) => {
        this.fondedTransaction = response.data ?? null;
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Hubo un error al buscar la transacción',
          type: NotificationType.Error,
        };
        this.errorMessage = 'Hubo un error al buscar la transacción';
        this.notificationService.show(notificationOptions);
      },
      complete: () => {
        this.loadingTransaction = false;
      },
    });
  }

  onSubmitForm(editedTransaction: TransactionEntity): void {
    this.transactionService.updateTransaction(editedTransaction);
  }
}
