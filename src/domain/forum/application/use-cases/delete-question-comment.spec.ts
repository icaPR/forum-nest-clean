import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comment-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { DeleteQuestionCommentUseCase } from "./delete-question-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: DeleteQuestionCommentUseCase;

describe("Delete question comment", async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to delete a question comment", async () => {
    const questionComment = makeQuestionComment();
    await inMemoryQuestionCommentsRepository.create(questionComment);

    await sut.handle({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    });
    expect(inMemoryQuestionCommentsRepository.item).toHaveLength(0);
  });
  it("should not be able to delete a question comment", async () => {
    const answerComment = makeQuestionComment({
      authorId: new UniqueEntityID("author1"),
    });
    await inMemoryQuestionCommentsRepository.create(answerComment);

    const result = await sut.handle({
      questionCommentId: answerComment.id.toString(),
      authorId: "author2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
