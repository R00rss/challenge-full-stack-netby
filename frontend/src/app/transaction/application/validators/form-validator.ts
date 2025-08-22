import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { TransactionService } from '../services/transaction-service';

export class FormValidator {
  static isStockEnough(
    transactionService: TransactionService,
    idProduct: string
  ): ValidatorFn {
    return (control: AbstractControl<number>): ValidationErrors | null => {
      const stock = control.value;
      console.log(idProduct, stock);
      if (!idProduct || !stock) return null;
      return timer(500).pipe(
        switchMap(() => {
          return transactionService.isStockEnough(idProduct, stock).pipe(
            map((exists) => (exists ? { isStockEnough: false } : null)),
            catchError((error) => {
              console.error('Error al verificar el stock:', error);
              return of(null);
            })
          );
        })
      );
    };
  }

  static isTransactionDateGraterThanToday(): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => {
      const releaseDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return releaseDate > today
        ? { isTransactionDateGraterThanToday: true }
        : null;
    };
  }
}
