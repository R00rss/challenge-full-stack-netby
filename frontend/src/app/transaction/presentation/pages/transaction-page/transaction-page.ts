import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table-component/transaction-table-component';
import { TransactionModalDelete } from '../../components/transaction-modal-delete/transaction-modal-delete';
import { TransactionService } from '@/app/transaction/application/services/transaction-service';
import { TransactionPageHeader } from '../../components/transaction-page-header/transaction-page-header';
import { CoreButtonBackComponent } from '@/app/core/presentation/components/core-button-back-component/core-button-back-component';

@Component({
  selector: 'transaction-page',
  imports: [
    TransactionTableComponent,
    PageLayoutComponent,
    TransactionModalDelete,
    TransactionPageHeader,
    CoreButtonBackComponent,
  ],
  templateUrl: './transaction-page.html',
  styleUrl: './transaction-page.css',
})
export class TransactionPage implements OnInit {
  constructor(private transactionService: TransactionService) {}
  ngOnInit(): void {
    this.transactionService.loadTransactions();
    this.transactionService.state$.subscribe((state) => {
      console.log({ state });
      console.log(state.isLoading);
    });
  }
}
