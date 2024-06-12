import { Either, left, right } from "@/core/either";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";

interface DeleteQuestionCommentUseCaseReq {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseRes = Either<
  {},
  ResourceNotFoundError | NotAllowedError
>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}

  async handle({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseReq): Promise<DeleteQuestionCommentUseCaseRes> {
    const questionComment = await this.questionCommentRepository.findById(
      questionCommentId
    );

    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }
    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }

    await this.questionCommentRepository.delete(questionComment);
    return right({});
  }
}
