import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { Injectable } from "@nestjs/common";

interface FetchQuestionAnswersUseCaseReq {
  page: number;
  questionId: string;
}

type FetchQuestionAnswersUseCaseRes = Either<
  {
    answers: Answer[];
  },
  null
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async handle({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseReq): Promise<FetchQuestionAnswersUseCaseRes> {
    const answers = await this.answerRepository.findManyByQuestionId(
      questionId,
      { page }
    );

    return right({ answers });
  }
}
