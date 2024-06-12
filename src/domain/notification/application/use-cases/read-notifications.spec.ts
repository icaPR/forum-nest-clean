import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeNotification } from "test/factories/make-notifications";
import { ReadNotificationUseCase } from "./read-notifications";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Read notification ", async () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to read a notification ", async () => {
    const notification = makeNotification({});

    inMemoryNotificationsRepository.create(notification);

    const result = await sut.handle({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.item[0].readAt).toEqual(
      expect.any(Date)
    );
  });
  it("should not be able to read a notification from another user", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID("recipient1"),
    });
    inMemoryNotificationsRepository.create(notification);

    const result = await sut.handle({
      notificationId: notification.id.toString(),
      recipientId: "recipient2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
