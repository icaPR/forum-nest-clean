import { Either, left, right } from "@/core/either";
import { AnswerRepository } from "../repositories/answers-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface DeleteAnswerUseCaseReq {
  answerId: string;
  authorId: string;
}

type DeleteAnswerUseCaseRes = Either<
  {},
  ResourceNotFoundError | NotAllowedError
>;

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
