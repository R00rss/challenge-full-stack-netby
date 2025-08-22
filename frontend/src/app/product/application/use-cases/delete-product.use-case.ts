import { Inject, Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product-repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(productId: string) {
    return this.productRepository.delete(productId);
  }
}
