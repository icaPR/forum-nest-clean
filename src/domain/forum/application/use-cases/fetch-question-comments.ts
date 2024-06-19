import { Either, right } from "@/core/either";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-object/comment-with-authr";

interface FetchQuestionCommentsUseCaseReq {
  page: number;
  questionId: string;
}

type FetchQuestionCommentsUseCaseRes = Either<
  {
    comments: CommentWithAuthor[];
  },
  null
>;
@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async handle({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseReq): Promise<FetchQuestionCommentsUseCaseRes> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        {
          page,
        }
      );

    return right({ comments });
  }
}
