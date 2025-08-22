import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { TransactionForm } from '../../components/transaction-form/transaction-form';
import { TransactionService } from '@/app/transaction/application/services/transaction-service';
import TransactionEntity from '@/app/transaction/domain/entities/transaction.entity';
import { CoreButtonBackComponent } from '@/app/core/presentation/components/core-button-back-component/core-button-back-component';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import { ProductService } from '@/app/product/application/services/product-service';
import { ProductQuery } from '@/app/product/domain/value-objects/product-query';

@Component({
  selector: 'app-transaction-create-page',
  imports: [PageLayoutComponent, TransactionForm, CoreButtonBackComponent],
  templateUrl: './transaction-create-page.html',
  styleUrl: './transaction-create-page.css',
})
export class TransactionCreatePage implements OnInit {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly productService: ProductService
  ) {}
  products: ProductEntity[] = [];

  ngOnInit(): void {
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

  onSubmitForm(newTransaction: TransactionEntity): void {
    this.transactionService.createTransaction(newTransaction);
  }
}
