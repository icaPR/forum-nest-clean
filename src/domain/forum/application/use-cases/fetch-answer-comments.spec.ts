import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comment-repository";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({ name: "Test name" });
    inMemoryStudentsRepository.item.push(student);

    const coment1 = makeAnswerComment({
      answerId: new UniqueEntityID("answer1"),
      authorId: student.id,
    });

    const coment2 = makeAnswerComment({
      answerId: new UniqueEntityID("answer2"),
      authorId: student.id,
    });

    const coment3 = makeAnswerComment({
      answerId: new UniqueEntityID("answer1"),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(coment1);
    await inMemoryAnswerCommentsRepository.create(coment2);
    await inMemoryAnswerCommentsRepository.create(coment3);

    const result = await sut.handle({
      answerId: "answer1",
      page: 1,
    });

    expect(result.value?.comments).toHaveLength(2);
  });

  it("should be able to fetch pagination answer comments", async () => {
    const student = makeStudent({ name: "Test name" });
    inMemoryStudentsRepository.item.push(student);
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer1"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.handle({
      page: 1,
      answerId: "answer1",
    });
    expect(result.value?.comments).toHaveLength(20);
  });
});
