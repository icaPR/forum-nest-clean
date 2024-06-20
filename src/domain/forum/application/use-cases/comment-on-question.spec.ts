import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comment-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Create a comment on question ", async () => {
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
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });

  it("should be able to comment a question ", async () => {
    const question = makeQuestion();
    await inMemoryQuestionsRepository.create(question);

    await sut.handle({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: "Comment!",
    });
    expect(inMemoryQuestionCommentsRepository.item[0].content).toEqual(
      "Comment!"
    );
  });
});
