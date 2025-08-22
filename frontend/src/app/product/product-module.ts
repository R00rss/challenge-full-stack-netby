import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing-module';
import HttpProductRepository from '@/app/product/infrastructure/repositories/product-repository.implementation';
import { ProductRepository } from '@/app/product/domain/repositories/product-repository';
import { ProductService } from './application/services/product-service';

import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { EditProductUseCase } from './application/use-cases/edit-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { FindByIdProductUseCase } from './application/use-cases/find-by-id-product.use-case';
import { IsProductStockEnoughUseCase } from './application/use-cases/is-product-stock-enough.use-case';
import { SearchProductsUseCase } from './application/use-cases/search-products.use-case';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProductRoutingModule],
  providers: [
    {
      provide: ProductRepository,
      useClass: HttpProductRepository,
    },
    ProductService,
    CreateProductUseCase,
    EditProductUseCase,
    DeleteProductUseCase,
    FindByIdProductUseCase,
    IsProductStockEnoughUseCase,
    SearchProductsUseCase,
  ],
})
export class ProductModule {}
