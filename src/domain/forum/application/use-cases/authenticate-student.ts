import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students-repository";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "./errors/wrong-credentials-error";

interface AuthenticateStudentUseCaseReq {
  email: string;
  password: string;
}

type AuthenticateStudentUseCaseRes = Either<
  {
    accessToken: string;
  },
  WrongCredentialsError
>;
@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private encrypter: Encrypter,
    private hashComparer: HashComparer,
    private studentRepository: StudentsRepository
  ) {}

  async handle({
    email,
    password,
  }: AuthenticateStudentUseCaseReq): Promise<AuthenticateStudentUseCaseRes> {
    const student = await this.studentRepository.findByEmail(email);

    if (!student) {
      return left(new WrongCredentialsError());
    }

    const isValidePassword = await this.hashComparer.compare(
      password,
      student.password
    );

    if (!isValidePassword) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    });

    return right({ accessToken });
  }
}
