import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionRoutingModule } from './transaction-routing-module';
import HttpTransactionRepository from '@/app/transaction/infrastructure/repositories/transaction-repository.implementation';
import { TransactionRepository } from '@/app/transaction/domain/repositories/transaction-repository';
import { TransactionService } from './application/services/transaction-service';

import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { EditTransactionUseCase } from './application/use-cases/edit-transaction.use-case';
import { DeleteTransactionUseCase } from './application/use-cases/delete-transaction.use-case';
import { FindByIdTransactionUseCase } from './application/use-cases/find-by-id-transaction.use-case';
import { IsTransactionStockEnoughUseCase } from './application/use-cases/is-transaction-stock-enough.use-case';
import { SearchTransactionsUseCase } from './application/use-cases/search-transaction.use-case';
import { FindByIdProductUseCase } from '../product/application/use-cases/find-by-id-product.use-case';
import { ProductService } from '../product/application/services/product-service';
import { CreateProductUseCase } from '../product/application/use-cases/create-product.use-case';
import { EditProductUseCase } from '../product/application/use-cases/edit-product.use-case';
import { DeleteProductUseCase } from '../product/application/use-cases/delete-product.use-case';
import { IsProductStockEnoughUseCase } from '../product/application/use-cases/is-product-stock-enough.use-case';
import { SearchProductsUseCase } from '../product/application/use-cases/search-products.use-case';
import { ProductRepository } from '../product/domain/repositories/product-repository';
import HttpProductRepository from '../product/infrastructure/repositories/product-repository.implementation';

@NgModule({
  declarations: [],
  imports: [CommonModule, TransactionRoutingModule],
  providers: [
    {
      provide: TransactionRepository,
      useClass: HttpTransactionRepository,
    },
    {
      provide: ProductRepository,
      useClass: HttpProductRepository,
    },
    TransactionService,
    CreateTransactionUseCase,
    EditTransactionUseCase,
    DeleteTransactionUseCase,
    FindByIdTransactionUseCase,
    IsTransactionStockEnoughUseCase,
    SearchTransactionsUseCase,

    CreateProductUseCase,
    EditProductUseCase,
    DeleteProductUseCase,
    FindByIdProductUseCase,
    IsProductStockEnoughUseCase,
    SearchProductsUseCase,
    ProductService,
  ],
})
export class TransactionModule {}
