import ProductEntity from '@/app/product/domain/entities/product.entity';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThreeDotsIconComponent } from '@/app/core/presentation/icon/three-dots-icon-component/three-dots-icon-component';
import { OptionProductClick } from '@/app/product/application/services/product-service';

@Component({
  selector: 'product-table-body-component',
  imports: [ThreeDotsIconComponent],
  templateUrl: './product-table-body-component.html',
  styleUrl: './product-table-body-component.css',
})
export class ProductTableBodyComponent {
  @Input() products!: ProductEntity[];
  @Input() options!: { label: string; operation: string }[];
  @Output() onOptionClick = new EventEmitter<OptionProductClick>();

  isDropdownSelected = '';

  toggleDropdown(productId: string): void {
    this.isDropdownSelected = productId;
  }

  closeDropdown(): void {
    this.isDropdownSelected = '';
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  handleOptionClick(operation: string, product: ProductEntity): void {
    this.onOptionClick.emit({
      operation,
      product,
    });
    this.closeDropdown();
  }

  onImageError(event: any): void {
    event.target.src = 'assets/default.png';
  }
}
