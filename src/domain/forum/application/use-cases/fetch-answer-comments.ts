import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Injectable } from "@nestjs/common";

interface FetchAnswerCommentsUseCaseReq {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsUseCaseRes = Either<
  {
    answerComments: AnswerComment[];
  },
  null
>;
@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async handle({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseReq): Promise<FetchAnswerCommentsUseCaseRes> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      });

    return right({ answerComments });
  }
}
