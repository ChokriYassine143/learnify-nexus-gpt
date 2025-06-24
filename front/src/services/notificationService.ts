import { Notification } from '@/types';
import { notificationApi } from './api';

class NotificationService {
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data } = await notificationApi.getNotifications(userId);
    return data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await notificationApi.markAsRead(notificationId);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await notificationApi.deleteNotification(notificationId);
  }
}

export const notificationService = new NotificationService(); 