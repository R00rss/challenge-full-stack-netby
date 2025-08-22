import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionPage } from './presentation/pages/transaction-page/transaction-page';
import { TransactionCreatePage } from './presentation/pages/transaction-create-page/transaction-create-page';
import { TransactionEditPage } from './presentation/pages/transaction-edit-page/transaction-edit-page';

const routes: Routes = [
  {
    path: '',
    component: TransactionPage,
    data: { title: 'Transacciones' },
  },
  {
    path: 'create',
    component: TransactionCreatePage,
    data: { title: 'Crear Transactiono' },
  },
  {
    path: 'edit/:id',
    component: TransactionEditPage,
    data: { title: 'Editar Transactiono' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule {}
