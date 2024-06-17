import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer";
import { makeQuestion } from "test/factories/make-questions";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: ChooseQuestionBestAnswerUseCase;

describe("Choose question best answer", async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswerRepository
    );
  });

  it("should be able to choose question best answer", async () => {
    const newQuestion = makeQuestion();
    const newAnswer = makeAnswer({ questionId: newQuestion.id });

    await inMemoryQuestionsRepository.create(newQuestion);
    await inMemoryAnswerRepository.create(newAnswer);

    await sut.handle({
      answerId: newAnswer.id.toValue(),
      authorId: newQuestion.authorId.toValue(),
    });

    expect(inMemoryQuestionsRepository.item[0].bestAnswerId).toEqual(
      newAnswer.id
    );
  });
  it("should not be able to choose another user question best answer", async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID("author1"),
    });
    const newAnswer = makeAnswer({ questionId: newQuestion.id });

    await inMemoryQuestionsRepository.create(newQuestion);
    await inMemoryAnswerRepository.create(newAnswer);

    const result = await sut.handle({
      answerId: newAnswer.id.toValue(),
      authorId: "author2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
