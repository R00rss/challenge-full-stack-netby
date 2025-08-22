import { SortDirection } from '@/app/core/domain/enums/sort-direction';
import { InfoIconComponent } from '@/app/core/presentation/icon/info-icon-component/info-icon-component';
import { SortUpIconComponent } from '@/app/core/presentation/icon/sort-up-icon-component/sort-up-icon-component';
import { SortDownIconComponent } from '@/app/core/presentation/icon/sort-down-icon-component/sort-down-icon-component';
import { TransactionService } from '@/app/transaction/application/services/transaction-service';
import TransactionEntity from '@/app/transaction/domain/entities/transaction.entity';
import { Component } from '@angular/core';

type Header = {
  id: keyof TransactionEntity;
  name: string;
  description: string;
  canSort: boolean;
  sortDirection: SortDirection | null;
};

@Component({
  selector: 'transaction-table-header-component',
  imports: [InfoIconComponent, SortUpIconComponent, SortDownIconComponent],
  templateUrl: './transaction-table-header-component.html',
  styleUrl: './transaction-table-header-component.css',
})
export class TransactionTableHeaderComponent {
  headers: Header[] = [
    {
      id: 'transactionDate',
      name: 'Fecha',
      description: 'Fecha del Transacción',
      canSort: false,
      sortDirection: null,
    },
    {
      id: 'transactionType',
      name: 'Tipo',
      description: 'Tipo de transacción',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'productId',
      name: 'Id de producto',
      description: 'Id de producto',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'quantity',
      name: 'Cantidad',
      description: 'Cantidad del transacción',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'unitPrice',
      name: 'Precio unitario',
      description: 'Precio unitario del transacción',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'totalPrice',
      name: 'Total',
      description: 'Total del transacción',
      canSort: true,
      sortDirection: null,
    },
    {
      id: 'detail',
      name: 'Detalles',
      description: 'Detalles del transacción',
      canSort: true,
      sortDirection: null,
    },
  ];
  constructor(private readonly transactionService: TransactionService) {}

  handleClickSortColumn(header: Header) {
    const newHeader = this.changeSortDirection(header);
    this.transactionService.changeSortColumn(
      newHeader.id,
      newHeader.sortDirection
    );
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
