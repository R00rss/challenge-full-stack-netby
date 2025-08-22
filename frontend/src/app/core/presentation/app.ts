import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreToastComponent } from './components/core-toast-component/core-toast-component';
import { CoreLoadingComponent } from './components/core-loading-component/core-loading-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CoreToastComponent, CoreLoadingComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
