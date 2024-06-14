import { Either, left, right } from "@/core/either";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface DeleteAnswerCommentUseCaseReq {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentUseCaseRes = Either<
  {},
  ResourceNotFoundError | NotAllowedError
>;
@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private questionCommentRepository: AnswerCommentsRepository) {}

  async handle({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseReq): Promise<DeleteAnswerCommentUseCaseRes> {
    const answerComment = await this.questionCommentRepository.findById(
      answerCommentId
    );

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }
    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentRepository.delete(answerComment);
    return right({});
  }
}
