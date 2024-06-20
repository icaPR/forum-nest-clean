import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-questions";
import { DeleteQuestionUseCase } from "./delete-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: DeleteQuestionUseCase;

describe("Delete question", async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository
    );
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to delete a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author1") },
      new UniqueEntityID("question1")
    );
    inMemoryQuestionsRepository.create(newQuestion);

    inMemoryQuestionAttachmentRepository.item.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("1"),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID("2"),
      })
    );
    await sut.handle({ questionId: "question1", authorId: "author1" });

    expect(inMemoryQuestionsRepository.item).toHaveLength(0);
    expect(inMemoryQuestionAttachmentRepository.item).toHaveLength(0);
  });
  it("should not be able to delete a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author1") },
      new UniqueEntityID("question1")
    );
    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.handle({
      questionId: "question1",
      authorId: "author2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
