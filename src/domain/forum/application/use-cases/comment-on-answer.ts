import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { AnswerRepository } from "../repositories/answers-repository";
import { AnswerCommentsRepository } from "../repositories/answer-comments-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";

interface CommentOnAnswerUseCaseReq {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseRes = Either<
  {
    answerComment: AnswerComment;
  },
  ResourceNotFoundError
>;

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswerRepository,
    private answerCommentRepository: AnswerCommentsRepository
  ) {}

  async handle({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseReq): Promise<CommentOnAnswerUseCaseRes> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    });

    await this.answerCommentRepository.create(answerComment);

    return right({ answerComment });
  }
}
