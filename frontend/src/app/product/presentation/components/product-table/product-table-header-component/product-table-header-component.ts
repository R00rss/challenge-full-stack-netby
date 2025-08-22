import { SortDirection } from '@/app/core/domain/enums/sort-direction';
import { InfoIconComponent } from '@/app/core/presentation/icon/info-icon-component/info-icon-component';
import { SortUpIconComponent } from '@/app/core/presentation/icon/sort-up-icon-component/sort-up-icon-component';
import { SortDownIconComponent } from '@/app/core/presentation/icon/sort-down-icon-component/sort-down-icon-component';
import { ProductService } from '@/app/product/application/services/product-service';
import ProductEntity from '@/app/product/domain/entities/product.entity';
import { Component } from '@angular/core';

type Header = {
  id: keyof ProductEntity;
  name: string;
  description: string;
  canSort: boolean;
  sortDirection: SortDirection | null;
};

@Component({
  selector: 'product-table-header-component',
  imports: [InfoIconComponent, SortUpIconComponent, SortDownIconComponent],
  templateUrl: './product-table-header-component.html',
  styleUrl: './product-table-header-component.css',
})
export class ProductTableHeaderComponent {
  headers: Header[] = [
    {
      id: 'image',
      name: 'Imagen',
      description: 'Imagen del producto',
      canSort: false,
      sortDirection: null,
    },
    {
      id: 'name',
      name: 'Producto',
      description: 'Nombre del producto',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'description',
      name: 'Descripción',
      description: 'Descripción del producto',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'category',
      name: 'Categoría',
      description: 'Categoría del producto',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'price',
      name: 'Precio',
      description: 'Precio del producto',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'stock',
      name: 'Stock',
      description: 'Stock del producto',
      canSort: true,
      sortDirection: null,
    },
  ];
  constructor(private readonly productService: ProductService) {}

  handleClickSortColumn(header: Header) {
    const newHeader = this.changeSortDirection(header);
    this.productService.changeSortColumn(newHeader.id, newHeader.sortDirection);
  }

  changeSortDirection(header: Header) {
    const newHeader = { ...header };
    if (header.sortDirection === null) {
      newHeader.sortDirection = SortDirection.ASC;
    }
    if (header.sortDirection === SortDirection.ASC) {
      newHeader.sortDirection = SortDirection.DESC;
    }
    if (header.sortDirection === SortDirection.DESC) {
      newHeader.sortDirection = null;
    }
    this.headers = this.headers.map((prevHeader) => {
      if (prevHeader.id === header.id) {
        return newHeader;
      }
      const resetHeader = { ...prevHeader, sortDirection: null };
      return resetHeader;
    });
    return newHeader;
  }
}
