import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comment-repository";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe("Delete answer comment", async () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to delete a answer comment", async () => {
    const answerComment = makeAnswerComment();
    await inMemoryAnswerCommentsRepository.create(answerComment);

    await sut.handle({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    });
    expect(inMemoryAnswerCommentsRepository.item).toHaveLength(0);
  });
  it("should not be able to delete a answer comment", async () => {
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID("author1"),
    });
    await inMemoryAnswerCommentsRepository.create(answerComment);

    const result = await sut.handle({
      answerCommentId: answerComment.id.toString(),
      authorId: "author2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
