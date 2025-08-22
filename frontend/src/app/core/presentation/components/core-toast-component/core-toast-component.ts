import {
  NotificationService,
  NotificationType,
} from '@/app/core/application/services/notification/notification-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'core-toast-component',
  imports: [CommonModule],
  templateUrl: './core-toast-component.html',
  styleUrl: './core-toast-component.css',
})
export class CoreToastComponent {
  isOpen: boolean = false;
  message: string | null = null;
  type: NotificationType | null = null;
  title = '';

  constructor(private toastService: NotificationService) {
    this.toastService.state$.subscribe((state) => {
      this.isOpen = state.isOpen;
      this.message = state.message;
      this.type = state.type;

      if (state.type) {
        this.title = this.getTitle(state.type);
      }
    });
  }

  private getTitle(type: NotificationType): string {
    switch (type) {
      case NotificationType.Success:
        return 'Éxito';
      case NotificationType.Error:
        return 'Error';
      case NotificationType.Info:
        return 'Información';
      default:
        return '';
    }
  }
}
