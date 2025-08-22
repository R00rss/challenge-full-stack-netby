import ProductEntity from '@/app/product/domain/entities/product.entity';

export class ProductCriteria {
  constructor(public readonly searchTerm: string = '') {}

  matches(product: ProductEntity): boolean {
    if (!this.searchTerm) return true;

    const term = this.searchTerm.toLowerCase();
    return (
      product.id.toString().includes(term) ||
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  }

  isEmpty(): boolean {
    return !this.searchTerm.trim();
  }
}
