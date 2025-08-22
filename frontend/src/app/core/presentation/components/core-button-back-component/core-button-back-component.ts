import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'core-button-back-component',
  imports: [],
  templateUrl: './core-button-back-component.html',
  styleUrl: './core-button-back-component.css',
})
export class CoreButtonBackComponent {
  constructor(private location: Location) {}

  navigateToBack(): void {
    this.location.back();
  }
}
