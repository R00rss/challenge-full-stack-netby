import { LoadingService } from '@/app/core/application/services/loading/loading-service';
import { Component } from '@angular/core';

@Component({
  selector: 'core-loading-component',
  imports: [],
  templateUrl: './core-loading-component.html',
  styleUrl: './core-loading-component.css',
})
export class CoreLoadingComponent {
  isBlock = false;

  constructor(private readonly loadingService: LoadingService) {
    this.loadingService.isBlock$.subscribe((isBlock) => {
      this.isBlock = isBlock;
    });
  }
}
