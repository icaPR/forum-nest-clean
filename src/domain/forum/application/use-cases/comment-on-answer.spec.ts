import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comment-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: CommentOnAnswerUseCase;

describe("Create a comment on answer ", async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerCommentsRepository
    );
  });

  it("should be able to comment a answer ", async () => {
    const answer = makeAnswer();
    await inMemoryAnswerRepository.create(answer);

    await sut.handle({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: "Comment!",
    });
    expect(inMemoryAnswerCommentsRepository.item[0].content).toEqual(
      "Comment!"
    );
  });
});
