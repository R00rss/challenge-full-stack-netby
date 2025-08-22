import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import ProductEntity from '../../domain/entities/product.entity';
import { ProductQuery } from '../../domain/value-objects/product-query';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { Router } from '@angular/router';

import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { EditProductUseCase } from '../use-cases/edit-product.use-case';
import { DeleteProductUseCase } from '../use-cases/delete-product.use-case';
import { SearchProductsUseCase } from '../use-cases/search-products.use-case';

import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import { LoadingService } from '@/app/core/application/services/loading/loading-service';
import { Pagination } from '@/app/core/domain/value-objects/pagination';
import { IsProductStockEnoughUseCase } from '../use-cases/is-product-stock-enough.use-case';
import { Result } from '@/app/core/domain/entities/result';
import { FindByIdProductUseCase } from '../use-cases/find-by-id-product.use-case';
import { SortDirection } from '@/app/core/domain/enums/sort-direction';

export type OptionProductClick = {
  operation: string;
  product: ProductEntity;
};

type ProductServiceState = {
  products: PaginatedResult<ProductEntity>;
  isLoading: boolean;
  messageError: string | null;
  query: ProductQuery;

  isModalDeleteOpen: boolean;
  productToDelete: ProductEntity | null;
};

const initialState: ProductServiceState = {
  products: new PaginatedResult<ProductEntity>([], new Pagination()),
  messageError: null,
  isLoading: false,
  query: new ProductQuery(),
  isModalDeleteOpen: false,
  productToDelete: null,
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _state = new BehaviorSubject<ProductServiceState>(initialState);

  readonly state$ = this._state.asObservable();
  readonly products$ = this.state$.pipe(map((s) => s.products));
  readonly isLoading$ = this.state$.pipe(map((s) => s.isLoading));
  readonly messageError$ = this.state$.pipe(map((s) => s.messageError));

  readonly selectedProductToDelete$ = this.state$.pipe(
    map((s) => s.productToDelete)
  );

  readonly isModalDeleteOpen$ = this.state$.pipe(
    map((s) => s.isModalDeleteOpen)
  );

  constructor(
    private readonly findByIdProductUseCase: FindByIdProductUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly editProductUseCase: EditProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase,
    private readonly isProductStockEnoughUseCase: IsProductStockEnoughUseCase,

    private readonly notificationService: NotificationService,
    private readonly loadingService: LoadingService,
    private router: Router
  ) {}

  private updateState(changes: Partial<typeof this._state.value>): void {
    const currentState = this._state.value;
    this._state.next({ ...currentState, ...changes });
  }

  createProduct(product: ProductEntity) {
    this.loadingService.block();
    return this.createProductUseCase.execute(product).subscribe({
      next: (result) => {
        if (result.success) {
          const notificationOptions = {
            message: 'Producto creado exitosamente',
            type: NotificationType.Success,
          };
          this.notificationService.show(notificationOptions);
          const url = `/products`;
          this.router.navigateByUrl(url);
        } else {
          const notificationOptions = {
            message: 'Error al crear el producto',
            type: NotificationType.Error,
          };
          this.notificationService.show(notificationOptions);
        }
        this.loadingService.unblock();
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Error al crear el producto',
          type: NotificationType.Error,
        };
        this.notificationService.show(notificationOptions);
        this.loadingService.unblock();
      },
      complete: () => {
        this.loadingService.unblock();
      },
    });
  }

  updateProduct(product: ProductEntity) {
    this.loadingService.block();
    return this.editProductUseCase.execute(product).subscribe({
      next: (result) => {
        if (result.success) {
          const notificationOptions = {
            message: 'Producto editado exitosamente',
            type: NotificationType.Success,
          };
          this.notificationService.show(notificationOptions);
          const url = `/products`;
          this.router.navigateByUrl(url);
        } else {
          const notificationOptions = {
            message: 'Error al editar el producto',
            type: NotificationType.Error,
          };
          this.notificationService.show(notificationOptions);
        }
        this.loadingService.unblock();
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Error al editar el producto',
          type: NotificationType.Error,
        };
        this.notificationService.show(notificationOptions);
        this.loadingService.unblock();
      },
      complete: () => {
        this.loadingService.unblock();
      },
    });
  }

  findById(id: string): Observable<Result<ProductEntity>> {
    return this.findByIdProductUseCase.execute(id);
  }

  openModalDelete(product: ProductEntity): void {
    this.updateState({
      isModalDeleteOpen: true,
      productToDelete: product,
    });
  }

  cancelModalDelete(): void {
    this.updateState({
      isModalDeleteOpen: false,
      productToDelete: null,
    });
    const notificationOptions = {
      message: 'Se cancelo la acción',
      type: NotificationType.Info,
    };

    this.notificationService.show(notificationOptions);
  }

  confirmDeleteProduct(): void {
    const product = this._state.value.productToDelete;
    if (product) {
      this.updateState({
        isModalDeleteOpen: false,
        productToDelete: null,
      });
      this.deleteProductUseCase.execute(product.id).subscribe({
        next: (result) => {
          if (result.success) {
            const notificationOptions = {
              message: 'Producto eliminado exitosamente',
              type: NotificationType.Success,
            };
            this.notificationService.show(notificationOptions);
            const url = `/products`;
            this.router.navigateByUrl(url);
          } else {
            const notificationOptions = {
              message: 'Error al eliminar el producto',
              type: NotificationType.Error,
            };
            this.notificationService.show(notificationOptions);
          }
          this.loadingService.unblock();
        },
        error: (error) => {
          const notificationOptions = {
            message: 'Error al eliminar el producto',
            type: NotificationType.Error,
          };
          this.notificationService.show(notificationOptions);
        },
        complete: () => {
          this.loadProducts();
        },
      });
    }
  }

  onOptionProductClick({ operation, product }: OptionProductClick) {
    switch (operation) {
      case 'edit':
        const url = `/products/edit/${product.id}`;
        this.router.navigateByUrl(url);
        break;
      case 'delete':
        this.openModalDelete(product);
        break;
    }
  }

  isStockEnough(productId: string, stock: number): Observable<Result<boolean>> {
    return this.isProductStockEnoughUseCase.execute(productId, stock);
  }

  async loadProducts(productQuery = new ProductQuery()): Promise<void> {
    console.log('loading products');
    this.updateState({ isLoading: true });
    try {
      this.searchProductsUseCase.execute(productQuery).subscribe({
        next: (result) => {
          this.updateState({
            products: result,
            isLoading: false,
          });
        },
        error: (error) => {
          this.updateState({
            isLoading: false,
            messageError: error?.message ?? 'Error al buscar los productos',
          });
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al buscar los productos';

      this.updateState({
        isLoading: false,
        messageError: message,
      });
    }
  }

  changeFilter(searchTerm: string): void {
    const newQuery: ProductQuery = { ...this._state.value.query, searchTerm };

    this.updateState({
      ...this._state.value,
      query: newQuery,
    });

    this.loadProducts(newQuery);
  }

  changePageSize(size: number): void {
    console.log({ size });
    const newQuery: ProductQuery = {
      ...this._state.value.query,
      pageSize: size,
      page: 1,
    };

    this.updateState({
      ...this._state.value,
      query: newQuery,
    });

    this.loadProducts(newQuery);
  }

  changePage(newPage: number): void {
    const newQuery: ProductQuery = {
      ...this._state.value.query,
      page: newPage,
    };

    this.updateState({
      ...this._state.value,
      query: newQuery,
    });

    this.loadProducts(newQuery);
  }

  changeSortColumn(
    sortColumn: keyof ProductEntity,
    sortDirection: SortDirection | null
  ): void {
    let newQuery: ProductQuery = {
      ...this._state.value.query,
    };

    if (sortDirection) {
      newQuery.sortColumn = sortColumn;
      newQuery.sortDirection = sortDirection;
    }

    this.updateState({
      ...this._state.value,
      query: newQuery,
    });

    this.loadProducts(newQuery);
  }
}
