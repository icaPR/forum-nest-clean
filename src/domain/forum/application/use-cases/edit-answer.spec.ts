import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repositories";
import { EditAnswerUseCase } from "./edit-answer";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswersRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: EditAnswerUseCase;

describe("Edit answer", async () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerAttachmentRepository
    );
  });

  it("should be able to edit a question", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID("author1") },
      new UniqueEntityID("question1")
    );
    inMemoryAnswersRepository.create(newAnswer);

    await sut.handle({
      authorId: "author1",
      answerId: newAnswer.id.toValue(),
      content: "content",
      attachmentsIds: ["1", "3"],
    });

    expect(inMemoryAnswersRepository.item[0]).toMatchObject({
      content: "content",
    });
    expect(
      inMemoryAnswersRepository.item[0].attachments.currentItems
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.item[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("3") }),
    ]);
  });
  it("should not be able to edit a question from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID("author1") },
      new UniqueEntityID("question1")
    );
    inMemoryAnswersRepository.create(newAnswer);

    const result = await sut.handle({
      authorId: "author2",
      answerId: newAnswer.id.toValue(),
      content: "content",
      attachmentsIds: ["1", "3"],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
