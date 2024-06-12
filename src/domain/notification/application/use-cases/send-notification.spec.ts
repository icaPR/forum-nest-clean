import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { SendNotificationUseCase } from "./send-notification";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe("Send notification ", async () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it("should be able to send a notification ", async () => {
    const result = await sut.handle({
      recipientId: "1",
      title: "New Notification",
      content: "Content",
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.item[0]).toEqual(
      result.value?.notification
    );
  });
});
