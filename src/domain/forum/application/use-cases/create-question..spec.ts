import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CreateQuestionUseCase;

describe("Create a question ", async () => {
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
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to create a question ", async () => {
    const result = await sut.handle({
      authorId: "1",
      title: "New Question",
      content: "Content",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.item[0]).toEqual(result.value?.question);
    expect(
      inMemoryQuestionsRepository.item[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.item[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("2") }),
    ]);
  });
  it("should persist attachments when creating a new question ", async () => {
    const result = await sut.handle({
      authorId: "1",
      title: "New Question",
      content: "Content",
      attachmentsIds: ["1", "2"],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentRepository.item).toHaveLength(2);
    expect(inMemoryQuestionAttachmentRepository.item).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID("1"),
        }),
      ])
    );
  });
});
