import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import TransactionEntity from '@/app/transaction/domain/entities/transaction.entity';
import { FormValidator } from '@/app/transaction/application/validators/form-validator';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import ProductEntity from '@/app/product/domain/entities/product.entity';

@Component({
  selector: 'transaction-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrl: './transaction-form.css',
})
export class TransactionForm implements OnInit {
  @Input() initTransaction: TransactionEntity | null = null;
  @Input() formType: string = 'Crear';
  @Input() products!: ProductEntity[];
  @Output() onSubmitForm = new EventEmitter<TransactionEntity>();

  transactionTypes: { id: string; name: string }[] = [
    {
      id: 'Sale',
      name: 'Venta',
    },
    {
      id: 'Purchase',
      name: 'Compra',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  formKeys: string[] = [];

  transactionForm!: FormGroup;

  private initializeForm(): void {
    const formBuilderConfig = {
      transactionType: ['', [Validators.required]],
      transactionDate: [
        '',
        [Validators.required, FormValidator.isTransactionDateGraterThanToday()],
      ],
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unitPrice: ['', [Validators.required, Validators.min(0)]],
      totalPrice: [{ value: '', disabled: true }],
      detail: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
    };

    this.transactionForm = this.fb.group(formBuilderConfig);
    this.formKeys = Object.keys(formBuilderConfig);

    this.transactionForm
      .get('unitPrice')
      ?.valueChanges.subscribe(() => this.calculateTotalPrice());

    this.transactionForm
      .get('quantity')
      ?.valueChanges.subscribe(() => this.calculateTotalPrice());

    if (this.initTransaction) {
      this.initTransaction.transactionDate = this.formatDateForInput(
        this.initTransaction.transactionDate
      );

      this.transactionForm.patchValue(this.initTransaction);
      const foundProduct = this.products.find(
        (product) => product.id === this.initTransaction?.productId
      );

      this.transactionForm.get('productId')?.setValue(foundProduct?.id);
      // this.transactionForm.get('productId')?.disable();
    }
  }
  private formatDateForInput(dateString: string): string {
    return dateString.split('T')[0];
  }

  isFieldReadonly(fieldName: string): boolean {
    return this.initTransaction !== null && fieldName === 'productId';
  }

  calculateTotalPrice(): void {
    const unitPrice = Number(
      this.transactionForm.get('unitPrice')?.value ?? '0'
    );
    const quantity = Number(this.transactionForm.get('quantity')?.value ?? '0');
    let total = 0;
    if (unitPrice > 0 && quantity > 0) {
      total = unitPrice * quantity;
    } else {
      total = 0;
    }
    this.transactionForm.get('totalPrice')?.setValue(total);
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(
      field &&
      field.errors &&
      field.errors[errorType] &&
      (field.dirty || field.touched)
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.transactionForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        switch (fieldName) {
          case 'productId':
            return 'Debes seleccionar un producto!';
          case 'transactionType':
            return 'Debes seleccionar un tipo de transacción!';
          default:
            return 'Este campo es requerido!';
        }
      }

      if (field.errors['minlength']) {
        switch (fieldName) {
          case 'id':
            return 'El ID debe tener al menos 3 caracteres!';
          case 'name':
            return 'El nombre debe tener al menos 5 caracteres!';
          case 'description':
            return 'La descripción debe tener al menos 10 caracteres!';
          default:
            return 'Campo muy corto!';
        }
      }

      if (field.errors['maxlength']) {
        switch (fieldName) {
          case 'id':
            return 'El ID debe tener como máximo 10 caracteres!';
          case 'name':
            return 'El nombre debe tener como máximo 100 caracteres!';
          case 'description':
            return 'La descripción debe tener como máximo 200 caracteres!';
          default:
            return 'Campo muy largo!';
        }
      }

      if (field.errors['min']) {
        switch (fieldName) {
          case 'price':
            return 'El precio debe ser mayor que 0.';
          case 'stock':
            return 'El stock debe ser mayor que 0.';
          default:
            return 'Campo inválido!';
        }
      }

      console.log(field.errors);

      if (field.errors['isTransactionDateGraterThanToday']) {
        return 'La fecha de transacción debe ser menor o igual a hoy.';
      }
    }

    return '';
  }

  onSubmit(): void {
    if (!this.transactionForm.valid) {
      Object.keys(this.transactionForm.controls).forEach((key) => {
        const control = this.transactionForm.get(key);
        control?.markAsTouched();
      });

      const notificationOptions = {
        message:
          'El formulario es inválido. Por favor, corrige los errores y vuelve a intentarlo.',
        type: NotificationType.Error,
      };

      this.notificationService.show(notificationOptions);
      return;
    }

    const newTransaction = this.createTransactionEntity();
    console.log({ newTransaction });
    this.onSubmitForm.emit(newTransaction);
  }

  createTransactionEntity(): TransactionEntity {
    return {
      id: this.initTransaction ? this.initTransaction.id : '',
      detail: this.transactionForm.get('detail')?.value,
      quantity: Number(this.transactionForm.get('quantity')?.value),
      totalPrice: Number(this.transactionForm.get('totalPrice')?.value),
      transactionDate: this.transactionForm.get('transactionDate')?.value,
      productId: this.transactionForm.get('productId')?.value,
      transactionType: this.transactionForm.get('transactionType')?.value,
      unitPrice: Number(this.transactionForm.get('unitPrice')?.value),
    };
  }

  onReset(): void {
    this.transactionForm.reset();
    this.initializeForm();
  }

  isSubmitDisabled(): boolean {
    return this.transactionForm.invalid;
  }

  isFieldValidating(fieldName: string): boolean {
    const field = this.transactionForm.get(fieldName);
    return !!(field && field.pending);
  }

  getNameByIdItemForm(itemForm: string) {
    switch (itemForm) {
      case 'id':
        return 'ID';
      case 'transactionDate':
        return 'Fecha transacción';
      case 'transactionType':
        return 'Tipo de transacción';
      case 'productId':
        return 'Producto';
      case 'quantity':
        return 'Cantidad';
      case 'unitPrice':
        return 'Precio unitario';
      case 'totalPrice':
        return 'Precio total';
      case 'detail':
        return 'Detalle transacción';
      default:
        return itemForm;
    }
  }

  getTypeByIdItemForm(itemForm: string) {
    switch (itemForm) {
      case 'transactionType':
        return 'comboBoxTransactionType';
      case 'productId':
        return 'comboBoxProduct';
      case 'transactionDate':
        return 'date';
      case 'quantity':
      case 'unitPrice':
      case 'totalPrice':
        return 'number';
      default:
        return 'text';
    }
  }
}
