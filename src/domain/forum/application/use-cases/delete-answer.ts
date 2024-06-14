import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerUseCaseReq {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseRes = Either<
  {},
  ResourceNotFoundError | NotAllowedError
>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async handle({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseReq): Promise<DeleteAnswerUseCaseRes> {
    const question = await this.answerRepository.findById(answerId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }
    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    await this.answerRepository.delete(question);

    return right({});
  }
}
