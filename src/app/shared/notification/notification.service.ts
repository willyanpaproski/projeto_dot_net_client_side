// notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private counter = 0;

  show(message: string, type: NotificationType = 'success') {
    const id = this.counter++;
    const notification: Notification = { id, message, type };

    this.notifications.push(notification);
    this.notificationsSubject.next([...this.notifications]);

    // Remove após 5s
    setTimeout(() => this.remove(id), 5000);
  }

  remove(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }
}
