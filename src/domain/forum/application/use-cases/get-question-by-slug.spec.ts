import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repositories";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { makeQuestion } from "test/factories/make-questions";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repositories";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: GetQuestionBySlugUseCase;

describe("Get question by slug", async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug ", async () => {
    const newQuestion = makeQuestion();
    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.handle({ slug: "example-question" });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    });
  });
});
