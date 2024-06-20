import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Either, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notfication";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { Injectable } from "@nestjs/common";

export interface SendNotificationUseCaseReq {
  recipientId: string;
  title: string;
  content: string;
}

type SendNotificationUseCaseRes = Either<
  {
    notification: Notification;
  },
  null
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async handle({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseReq): Promise<SendNotificationUseCaseRes> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return right({ notification });
  }
}
