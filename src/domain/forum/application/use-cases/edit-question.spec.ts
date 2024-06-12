import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories";
import { makeQuestion } from "test/factories/make-questions";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repositories";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: EditQuestionUseCase;

describe("Edit question", async () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentRepository
    );
  });

  it("should be able to edit a question", async () => {
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

    await sut.handle({
      authorId: "author1",
      questionId: newQuestion.id.toValue(),
      title: "title",
      content: "content",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryQuestionsRepository.item[0]).toMatchObject({
      title: "title",
      content: "content",
    });

    expect(
      inMemoryQuestionsRepository.item[0].attachments.currentItems
    ).toHaveLength(2);
    expect(
      inMemoryQuestionsRepository.item[0].attachments.currentItems
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);
  });
  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("author1") },
      new UniqueEntityID("question1")
    );
    inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.handle({
      authorId: "author2",
      questionId: newQuestion.id.toValue(),
      title: "title",
      content: "content",
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
