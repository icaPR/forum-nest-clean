import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notfication";

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public item: Notification[] = [];

  async create(notification: Notification) {
    this.item.push(notification);
  }
  async findById(id: string) {
    const notification = this.item.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  async save(notification: Notification) {
    const index = this.item.findIndex((item) => item.id === notification.id);

    this.item[index] = notification;
  }
}
