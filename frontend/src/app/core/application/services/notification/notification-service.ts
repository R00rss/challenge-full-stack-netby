import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

type NotificationServiceState = {
  isOpen: boolean;
  message: string | null;
  type: NotificationType | null;
};

type ShowOptions = {
  message: string;
  type: NotificationType;
  timeMs?: number;
};

const initialState: NotificationServiceState = {
  isOpen: false,
  message: null,
  type: null,
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _state = new BehaviorSubject<NotificationServiceState>(initialState);
  readonly state$ = this._state.asObservable();

  show({ message, type, timeMs = 2000 }: ShowOptions): void {
    this._state.next({ isOpen: true, message, type });
    setTimeout(() => this.hide(), timeMs);
  }

  hide(): void {
    this._state.next({ isOpen: false, message: null, type: null });
  }
}
