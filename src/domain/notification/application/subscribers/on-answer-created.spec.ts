import { makeAnswer } from "test/factories/make-answer";
import { OnAnswerCreated } from "./on-answer-created";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import {
  SendNotificationUseCase,
  SendNotificationUseCaseReq,
} from "@/domain/notification/application/use-cases/send-notification";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeQuestion } from "test/factories/make-questions";
import { MockInstance } from "vitest";
import { waitFor } from "test/utils/wait-for";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;

let sendNotificationExecute: MockInstance<[SendNotificationUseCaseReq]>;

describe("On answer created", () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository
    );

    sendNotificationExecute = vi.spyOn(sendNotificationUseCase, "handle");

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });
  it("should send a notification when an new answer is created", async () => {
    const newQuestion = makeQuestion();
    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    });
    await inMemoryQuestionsRepository.create(newQuestion);
    await inMemoryAnswerRepository.create(newAnswer);

    await waitFor(() => {
      expect(sendNotificationExecute).toHaveBeenCalled();
    });
  });
});
