import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comment-repository";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch question comments", async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it("should be able to fetch question comments", async () => {
    const student = makeStudent({ name: "Test name" });

    inMemoryStudentsRepository.item.push(student);
    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID("question1"),
      authorId: student.id,
    });
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID("question1"),
      authorId: student.id,
    });
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID("question2"),
      authorId: student.id,
    });

    await inMemoryQuestionCommentsRepository.create(comment1);
    await inMemoryQuestionCommentsRepository.create(comment3);
    await inMemoryQuestionCommentsRepository.create(comment2);

    const result = await sut.handle({
      questionId: "question1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(2);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          author: "Test name",
          commentId: comment1.id,
        }),
        expect.objectContaining({
          author: "Test name",
          commentId: comment2.id,
        }),
      ])
    );
  });

  it("should be able to fetch pagination question comments", async () => {
    const student = makeStudent({ name: "Test name" });
    inMemoryStudentsRepository.item.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID("question1"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.handle({
      questionId: "question1",
      page: 2,
    });
    expect(result.value?.comments).toHaveLength(2);
  });
});
