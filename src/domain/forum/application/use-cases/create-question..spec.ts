import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories";
import { CreateQuestionUseCase } from "./create-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repositories";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: CreateQuestionUseCase;

describe("Create a question ", async () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
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
});
