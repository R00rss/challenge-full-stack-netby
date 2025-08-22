import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'inventory-card',
  imports: [],
  templateUrl: './inventory-card.html',
  styleUrl: './inventory-card.css',
})
export class InventoryCardTs {
  @Input() title!: string;
  @Input() path!: string;
  constructor(private router: Router) {}

  handleClick(path: string): void {
    this.router.navigate([path]);
  }
}
