import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'product-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  @Input() initProduct: ProductEntity | null = null;
  @Input() formType: string = 'Crear';
  @Output() onSubmitForm = new EventEmitter<ProductEntity>();

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  formKeys: string[] = [];

  productForm!: FormGroup;

  private initializeForm(): void {
    const formBuilderConfig = {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      image: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
    };

    this.productForm = this.fb.group(formBuilderConfig);
    this.formKeys = Object.keys(formBuilderConfig);
    console.log(this.formKeys);

    if (this.initProduct) {
      this.productForm.patchValue(this.initProduct);
      // this.productForm
      //   .get('stock')
      //   ?.addValidators(
      //     FormValidator.isStockEnough(
      //       this.productService,
      //       this.initProduct?.id || ''
      //     )
      //   );
    }
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(
      field &&
      field.errors &&
      field.errors[errorType] &&
      (field.dirty || field.touched)
    );
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.productForm.get(fieldName);

    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        switch (fieldName) {
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

      // if (!field.errors['isStockEnough']) {
      //   return 'El stock debe ser suficiente.';
      // }
    }

    return '';
  }

  onSubmit(): void {
    if (!this.productForm.valid) {
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key);
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

    const newProduct = this.createProductEntity();
    this.onSubmitForm.emit(newProduct);
  }

  createProductEntity(): ProductEntity {
    return {
      description: this.productForm.get('description')?.value,
      id: this.initProduct ? this.initProduct.id : '',
      image: this.productForm.get('image')?.value,
      name: this.productForm.get('name')?.value,
      category: this.productForm.get('category')?.value,
      price: this.productForm.get('price')?.value,
      stock: this.productForm.get('stock')?.value,
    };
  }

  onReset(): void {
    this.productForm.reset();
    this.initializeForm();
  }

  isSubmitDisabled(): boolean {
    return this.productForm.invalid;
  }

  isFieldValidating(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.pending);
  }

  getNameByIdItemForm(itemForm: string) {
    switch (itemForm) {
      case 'id':
        return 'ID';
      case 'name':
        return 'Nombre';
      case 'description':
        return 'Descripción';
      case 'image':
        return 'Imagen';
      case 'category':
        return 'Categoría';
      case 'price':
        return 'Precio';
      case 'stock':
        return 'Stock';
      default:
        return itemForm;
    }
  }

  getTypeByIdItemForm(itemForm: string) {
    switch (itemForm) {
      case 'id':
      case 'name':
      case 'description':
      case 'image':
      case 'category':
        return 'text';
      case 'price':
      case 'stock':
        return 'number';
      default:
        return 'text';
    }
  }
}
