import { Component } from '@angular/core';
import { PageLayoutComponent } from '@/app/core/presentation/layout/page-layout-component/page-layout-component';
import { InventoryCardTs } from '../../components/inventory-card/inventory-card';

@Component({
  selector: 'inventory-page',
  imports: [PageLayoutComponent, InventoryCardTs],
  templateUrl: './inventory-page.html',
  styleUrl: './inventory-page.css',
})
export class InventoryPage {
  sections = [
    {
      label: 'Productos',
      path: '/products',
    },
    {
      label: 'Transacciones',
      path: '/transactions',
    },
  ];
}
