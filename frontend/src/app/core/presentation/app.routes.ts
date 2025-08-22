import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@/app/inventory/inventory-module').then((m) => m.InventoryModule),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@/app/product/product-module').then((m) => m.ProductModule),
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('@/app/transaction/transaction-module').then(
        (m) => m.TransactionModule
      ),
  },
  // {
  //   path: '**',
  //   redirectTo: '/products',
  // },
];
