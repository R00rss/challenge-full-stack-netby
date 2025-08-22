import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPage } from './presentation/pages/product-page/product-page';
import { ProductCreatePage } from './presentation/pages/product-create-page/product-create-page';
import { ProductEditPage } from './presentation/pages/product-edit-page/product-edit-page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage,
    data: { title: 'Productos' },
  },
  {
    path: 'create',
    component: ProductCreatePage,
    data: { title: 'Crear Producto' },
  },
  {
    path: 'edit/:id',
    component: ProductEditPage,
    data: { title: 'Editar Producto' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
