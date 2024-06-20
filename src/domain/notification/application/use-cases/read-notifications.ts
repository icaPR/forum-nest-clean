import { Either, left, right } from "@/core/either";
import { Notification } from "../../enterprise/entities/notfication";
import { NotificationsRepository } from "../repositories/notifications-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface ReadNotificationUseCaseReq {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseRes = Either<
  {
    notification: Notification;
  },
  ResourceNotFoundError | NotAllowedError
>;

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async handle({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseReq): Promise<ReadNotificationUseCaseRes> {
    const notification = await this.notificationsRepository.findById(
      notificationId
    );

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError());
    }
    notification.read();

    await this.notificationsRepository.save(notification);

    return right({ notification });
  }
}
