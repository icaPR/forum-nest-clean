import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notfication";
import { Notification as PrismaNotification, Prisma } from "@prisma/client";

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        title: raw.title,
        content: raw.content,
        readAt: raw.readAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    );
  }
  static toPrisma(raw: Notification): Prisma.NotificationUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      recipientId: raw.recipientId.toString(),
      title: raw.title,
      content: raw.content,
      readAt: raw.readAt,
      createdAt: raw.createdAt,
    };
  }
}
