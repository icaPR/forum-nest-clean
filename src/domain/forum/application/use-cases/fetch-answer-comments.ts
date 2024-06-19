import { Either, right } from "@/core/either";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { Injectable } from "@nestjs/common";
import { CommentWithAuthor } from "../../enterprise/entities/value-object/comment-with-authr";

interface FetchAnswerCommentsUseCaseReq {
  page: number;
  answerId: string;
}

type FetchAnswerCommentsUseCaseRes = Either<
  {
    comments: CommentWithAuthor[];
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
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          page,
        }
      );

    return right({ comments });
  }
}
