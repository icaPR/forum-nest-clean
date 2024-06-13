import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { AuthenticateStudentUseCase } from "./authenticate-student";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { makeStudent } from "test/factories/make-student";
import { access } from "fs";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateStudentUseCase;

describe("Authenticate student ", async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateStudentUseCase(
      fakeEncrypter,
      fakeHasher,
      inMemoryStudentsRepository
    );
  });

  it("should be able to authenticate a student", async () => {
    const newStudent = makeStudent({
      email: "student@email.com",
      password: await fakeHasher.hash("123456"),
    });
    inMemoryStudentsRepository.create(newStudent);

    const result = await sut.handle({
      email: "student@email.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
  it.skip("should hash student password upon registration", async () => {
    const result = await sut.handle({
      email: "student@email.com",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.item[0].password).toEqual(hashedPassword);
  });
});
