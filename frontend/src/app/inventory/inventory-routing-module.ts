import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryPage } from './presentation/pages/inventory-page/inventory-page';

const routes: Routes = [
  {
    path: '',
    component: InventoryPage,
    data: { title: 'Inventario' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
