import { Either, right } from "@/core/either";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";

interface FetchQuestionCommentsUseCaseReq {
  page: number;
  questionId: string;
}

type FetchQuestionCommentsUseCaseRes = Either<
  {
    questionComments: QuestionComment[];
  },
  null
>;

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async handle({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseReq): Promise<FetchQuestionCommentsUseCaseRes> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({ questionComments });
  }
}
