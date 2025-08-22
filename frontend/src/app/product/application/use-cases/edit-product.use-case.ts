import { Injectable } from '@angular/core';
import { ProductRepository } from '../../domain/repositories/product-repository';
import ProductEntity from '../../domain/entities/product.entity';

@Injectable()
export class EditProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}
  execute(product: ProductEntity) {
    return this.productRepository.update(product);
  }
}
