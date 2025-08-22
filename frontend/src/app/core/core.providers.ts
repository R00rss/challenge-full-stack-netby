// core/core.providers.ts
import { Provider } from '@angular/core';
import { NotificationService } from './application/services/notification/notification-service';
import { LoadingService } from './application/services/loading/loading-service';

export function provideCoreServices(): Provider[] {
  return [NotificationService, LoadingService];
}
