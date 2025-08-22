import { Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { ProductQuery } from '../../domain/value-objects/product-query';

@Injectable()
export class SearchProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(query: ProductQuery) {
    return this.productRepository.search(query);
  }
}
