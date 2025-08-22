import { Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product-repository';

@Injectable()
export class IsProductStockEnoughUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(productId: string, stock: number) {
    return this.productRepository.isStockEnough(productId, stock);
  }
}
