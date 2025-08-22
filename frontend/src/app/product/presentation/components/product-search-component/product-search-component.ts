import { ProductService } from '@/app/product/application/services/product-service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';

const DEFAULT_DEBOUNCE_TIME = 300;

@Component({
  selector: 'product-search-component',
  imports: [],
  templateUrl: './product-search-component.html',
  styleUrl: './product-search-component.css',
})
export class ProductSearchComponent implements OnInit {
  @Output() searchChange = new EventEmitter<string>();

  searchTerm$ = new Subject<string>();
  searchTermSubscription: Subscription | undefined;
  constructor(private readonly productService: ProductService) {}

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
        this.productService.changeFilter(term);
      });
  }
}
