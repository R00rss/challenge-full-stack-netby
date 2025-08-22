import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import TransactionEntity from '../../domain/entities/transaction.entity';
import { TransactionQuery } from '../../domain/value-objects/transaction-query';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';
import { Router } from '@angular/router';

import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import { LoadingService } from '@/app/core/application/services/loading/loading-service';
import { Pagination } from '@/app/core/domain/value-objects/pagination';
import { Result } from '@/app/core/domain/entities/result';
import { SortDirection } from '@/app/core/domain/enums/sort-direction';
import { FindByIdTransactionUseCase } from '../use-cases/find-by-id-transaction.use-case';
import { CreateTransactionUseCase } from '../use-cases/create-transaction.use-case';
import { EditTransactionUseCase } from '../use-cases/edit-transaction.use-case';
import { DeleteTransactionUseCase } from '../use-cases/delete-transaction.use-case';
import { SearchTransactionsUseCase } from '../use-cases/search-transaction.use-case';
import { IsTransactionStockEnoughUseCase } from '../use-cases/is-transaction-stock-enough.use-case';

export type OptionTransactionClick = {
  operation: string;
  transaction: TransactionEntity;
};

type TransactionServiceState = {
  transactions: PaginatedResult<TransactionEntity>;
  isLoading: boolean;
  messageError: string | null;
  query: TransactionQuery;

  isModalDeleteOpen: boolean;
  transactionToDelete: TransactionEntity | null;
};

const initialState: TransactionServiceState = {
  transactions: new PaginatedResult<TransactionEntity>([], new Pagination()),
  messageError: null,
  isLoading: false,
  query: new TransactionQuery(),
  isModalDeleteOpen: false,
  transactionToDelete: null,
};

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private _state = new BehaviorSubject<TransactionServiceState>(initialState);

  readonly state$ = this._state.asObservable();
  readonly transactions$ = this.state$.pipe(map((s) => s.transactions));
  readonly isLoading$ = this.state$.pipe(map((s) => s.isLoading));
  readonly messageError$ = this.state$.pipe(map((s) => s.messageError));

  readonly selectedTransactionToDelete$ = this.state$.pipe(
    map((s) => s.transactionToDelete)
  );

  readonly isModalDeleteOpen$ = this.state$.pipe(
    map((s) => s.isModalDeleteOpen)
  );

  constructor(
    private readonly findByIdTransactionUseCase: FindByIdTransactionUseCase,
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly editTransactionUseCase: EditTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
    private readonly searchTransactionsUseCase: SearchTransactionsUseCase,
    private readonly isTransactionStockEnoughUseCase: IsTransactionStockEnoughUseCase,

    private readonly notificationService: NotificationService,
    private readonly loadingService: LoadingService,
    private router: Router
  ) {}

  private updateState(changes: Partial<typeof this._state.value>): void {
    const currentState = this._state.value;
    this._state.next({ ...currentState, ...changes });
  }

  createTransaction(transaction: TransactionEntity) {
    this.loadingService.block();
    return this.createTransactionUseCase.execute(transaction).subscribe({
      next: (result) => {
        if (result.success) {
          const notificationOptions = {
            message: 'Transactiono creado exitosamente',
            type: NotificationType.Success,
          };
          this.notificationService.show(notificationOptions);
          const url = `/transactions`;
          this.router.navigateByUrl(url);
        } else {
          const notificationOptions = {
            message: 'Error al crear el transactiono',
            type: NotificationType.Error,
          };
          this.notificationService.show(notificationOptions);
        }
        this.loadingService.unblock();
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Error al crear el transactiono',
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

  updateTransaction(transaction: TransactionEntity) {
    this.loadingService.block();
    return this.editTransactionUseCase.execute(transaction).subscribe({
      next: (result) => {
        if (result.success) {
          const notificationOptions = {
            message: 'Transactiono editado exitosamente',
            type: NotificationType.Success,
          };
          this.notificationService.show(notificationOptions);
          const url = `/transactions`;
          this.router.navigateByUrl(url);
        } else {
          const notificationOptions = {
            message: 'Error al editar el transactiono',
            type: NotificationType.Error,
          };
          this.notificationService.show(notificationOptions);
        }
        this.loadingService.unblock();
      },
      error: (error) => {
        const notificationOptions = {
          message: 'Error al editar el transactiono',
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

  findById(id: string): Observable<Result<TransactionEntity>> {
    return this.findByIdTransactionUseCase.execute(id);
  }

  openModalDelete(transaction: TransactionEntity): void {
    this.updateState({
      isModalDeleteOpen: true,
      transactionToDelete: transaction,
    });
  }

  cancelModalDelete(): void {
    this.updateState({
      isModalDeleteOpen: false,
      transactionToDelete: null,
    });
    const notificationOptions = {
      message: 'Se cancelo la acción',
      type: NotificationType.Info,
    };

    this.notificationService.show(notificationOptions);
  }

  confirmDeleteTransaction(): void {
    const transaction = this._state.value.transactionToDelete;
    if (transaction) {
      this.updateState({
        isModalDeleteOpen: false,
        transactionToDelete: null,
      });
      this.deleteTransactionUseCase.execute(transaction.id).subscribe({
        next: (result) => {
          if (result.success) {
            const notificationOptions = {
              message: 'Transactiono eliminado exitosamente',
              type: NotificationType.Success,
            };
            this.notificationService.show(notificationOptions);
            const url = `/transactions`;
            this.router.navigateByUrl(url);
          } else {
            const notificationOptions = {
              message: 'Error al eliminar el transactiono',
              type: NotificationType.Error,
            };
            this.notificationService.show(notificationOptions);
          }
          this.loadingService.unblock();
        },
        error: (error) => {
          const notificationOptions = {
            message: 'Error al eliminar el transactiono',
            type: NotificationType.Error,
          };
          this.notificationService.show(notificationOptions);
        },
        complete: () => {
          this.loadTransactions();
        },
      });
    }
  }

  onOptionTransactionClick({ operation, transaction }: OptionTransactionClick) {
    switch (operation) {
      case 'edit':
        const url = `/transactions/edit/${transaction.id}`;
        this.router.navigateByUrl(url);
        break;
      case 'delete':
        this.openModalDelete(transaction);
        break;
    }
  }

  isStockEnough(productId: string, stock: number): Observable<Result<boolean>> {
    return this.isTransactionStockEnoughUseCase.execute(productId, stock);
  }

  async loadTransactions(
    transactionQuery = new TransactionQuery()
  ): Promise<void> {
    console.log('loading transactions');
    this.updateState({ isLoading: true });
    try {
      this.searchTransactionsUseCase.execute(transactionQuery).subscribe({
        next: (result) => {
          this.updateState({
            transactions: result,
            isLoading: false,
          });
        },
        error: (error) => {
          this.updateState({
            isLoading: false,
            messageError: error?.message ?? 'Error al buscar los transacciones',
          });
        },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al buscar los transacciones';

      this.updateState({
        isLoading: false,
        messageError: message,
      });
    }
  }

  changeFilter(searchTerm: string): void {
    const newQuery: TransactionQuery = {
      ...this._state.value.query,
      searchTerm,
    };

    this.updateState({
      ...this._state.value,
      query: newQuery,
    });

    this.loadTransactions(newQuery);
  }

  changePageSize(size: number): void {
    console.log({ size });
    const newQuery: TransactionQuery = {
      ...this._state.value.query,
      pageSize: size,
      page: 1,
    };

    this.updateState({
      ...this._state.value,
      query: newQuery,
    });

    this.loadTransactions(newQuery);
  }

  changePage(newPage: number): void {
    const newQuery: TransactionQuery = {
      ...this._state.value.query,
      page: newPage,
    };

    this.updateState({
      ...this._state.value,
      query: newQuery,
    });

    this.loadTransactions(newQuery);
  }

  changeSortColumn(
    sortColumn: keyof TransactionEntity,
    sortDirection: SortDirection | null
  ): void {
    let newQuery: TransactionQuery = {
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

    this.loadTransactions(newQuery);
  }
}
