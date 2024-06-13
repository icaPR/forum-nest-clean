import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { RegisterStudentUseCase } from "./register-students";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let sut: RegisterStudentUseCase;

describe("Register student ", async () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    sut = new RegisterStudentUseCase(fakeHasher, inMemoryStudentsRepository);
  });

  it("should be able to register a new student ", async () => {
    const result = await sut.handle({
      name: "student1",
      email: "student@email.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.item[0],
    });
  });

  it("should hash student password upon registration", async () => {
    const result = await sut.handle({
      name: "student1",
      email: "student@email.com",
      password: "123456",
    });

    const hashedPassword = await fakeHasher.hash("123456");

    expect(result.isRight()).toBe(true);
    expect(inMemoryStudentsRepository.item[0].password).toEqual(hashedPassword);
  });
});
