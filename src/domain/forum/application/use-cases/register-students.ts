import { Student } from "./../../enterprise/entities/student";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface RegisterStudentUseCaseReq {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseRes = Either<
  {
    student: Student;
  },
  StudentAlreadyExistsError
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private hashGenerator: HashGenerator,
    private studentRepository: StudentsRepository
  ) {}

  async handle({
    name,
    email,
    password,
  }: RegisterStudentUseCaseReq): Promise<RegisterStudentUseCaseRes> {
    const studentWithSameEmail = await this.studentRepository.findByEmail(
      email
    );

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const student = Student.create({
      name,
      email,
      password: passwordHash,
    });
    await this.studentRepository.create(student);

    return right({ student });
  }
}
