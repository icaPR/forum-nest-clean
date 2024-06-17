import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";
import { InMemoryAnswerRepository } from "test/repositories/in-memory-answer-repository";
import { makeAnswer } from "test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerAttachmentRepository } from "test/repositories/in-memory-answer-attachment-repository";

let inMemoryAnswerRepository: InMemoryAnswerRepository;
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository;
let sut: FetchQuestionAnswersUseCase;

describe("Fetch question answer", async () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository();
    inMemoryAnswerRepository = new InMemoryAnswerRepository(
      inMemoryAnswerAttachmentRepository
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
  });

  it("should be able to fetch question answers", async () => {
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question1") })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question2") })
    );
    await inMemoryAnswerRepository.create(
      makeAnswer({ questionId: new UniqueEntityID("question1") })
    );

    const result = await sut.handle({ questionId: "question1", page: 1 });

    expect(result.value?.answers).toHaveLength(2);
  });

  it("should be able to fetch pagination question answers", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({ questionId: new UniqueEntityID("question1") })
      );
    }

    const result = await sut.handle({
      questionId: "question1",
      page: 1,
    });
    expect(result.value?.answers).toHaveLength(20);
  });
});
