import { TransactionService } from '@/app/transaction/application/services/transaction-service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';

const DEFAULT_DEBOUNCE_TIME = 300;

@Component({
  selector: 'transaction-search-component',
  imports: [],
  templateUrl: './transaction-search-component.html',
  styleUrl: './transaction-search-component.css',
})
export class TransactionSearchComponent implements OnInit {
  @Output() searchChange = new EventEmitter<string>();

  searchTerm$ = new Subject<string>();
  searchTermSubscription: Subscription | undefined;
  constructor(private readonly transactionService: TransactionService) {}

  ngOnInit(): void {
    this.setupSearchTermDebounce();
  }

  onSearchTermChange(event: any) {
    this.searchTerm$.next(event.target.value);
  }

  setupSearchTermDebounce() {
    this.searchTermSubscription = this.searchTerm$
      .pipe(debounceTime(DEFAULT_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((term) => {
        this.transactionService.changeFilter(term);
      });
  }
}
