import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comment-repositories";
import { makeQuestionComment } from "test/factories/make-question-comment";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch question comments", async () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question1") })
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question2") })
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID("question1") })
    );

    const result = await sut.handle({
      questionId: "question1",
      page: 1,
    });

    expect(result.value?.questionComments).toHaveLength(2);
  });

  it("should be able to fetch pagination question comments", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID("question1") })
      );
    }

    const result = await sut.handle({
      questionId: "question1",
      page: 2,
    });
    expect(result.value?.questionComments).toHaveLength(2);
  });
});
