import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-questions";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";
import { InMemoryQuestionAttachmentRepository } from "test/repositories/in-memory-question-attachment-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository;
let sut: FetchRecentQuestionsUseCase;

describe("Fetch recent questions", async () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository
    );
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to fetch recent questions ", async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2000, 0, 10) })
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2000, 0, 15) })
    );
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2000, 0, 20) })
    );

    const result = await sut.handle({ page: 1 });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2000, 0, 20) }),
      expect.objectContaining({ createdAt: new Date(2000, 0, 15) }),
      expect.objectContaining({ createdAt: new Date(2000, 0, 10) }),
    ]);
  });

  it("should be able to fetch pagination recent questions ", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(
        makeQuestion({ createdAt: new Date(2000, 0, i) })
      );
    }

    const result = await sut.handle({ page: 2 });

    expect(result.value?.questions).toHaveLength(2);
  });
});
