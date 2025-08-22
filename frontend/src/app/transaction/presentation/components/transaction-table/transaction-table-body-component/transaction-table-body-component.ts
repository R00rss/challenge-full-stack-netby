import TransactionEntity from '@/app/transaction/domain/entities/transaction.entity';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThreeDotsIconComponent } from '@/app/core/presentation/icon/three-dots-icon-component/three-dots-icon-component';
import { OptionTransactionClick } from '@/app/transaction/application/services/transaction-service';
import { DatePipe } from '@angular/common';
import { cutText } from '@/app/helpers/textTransform';

@Component({
  selector: 'transaction-table-body-component',
  imports: [ThreeDotsIconComponent, DatePipe],
  templateUrl: './transaction-table-body-component.html',
  styleUrl: './transaction-table-body-component.css',
})
export class TransactionTableBodyComponent {
  @Input() transactions!: TransactionEntity[];
  @Input() options!: { label: string; operation: string }[];
  @Output() onOptionClick = new EventEmitter<OptionTransactionClick>();

  isDropdownSelected = '';

  toggleDropdown(transactionId: string): void {
    this.isDropdownSelected = transactionId;
  }

  closeDropdown(): void {
    this.isDropdownSelected = '';
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  handleOptionClick(operation: string, transaction: TransactionEntity): void {
    this.onOptionClick.emit({
      operation,
      transaction,
    });
    this.closeDropdown();
  }

  onImageError(event: any): void {
    event.target.src = 'assets/default.png';
  }

  handleCutText(text: string, maxLength: number): string {
    return cutText(text, maxLength);
  }
}
