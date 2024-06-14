import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionsRepository } from "../repositories/questions-repository";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";

interface CommentOnQuestionUseCaseReq {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseRes = Either<
  {
    questionComment: QuestionComment;
  },
  ResourceNotFoundError
>;

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentRepository: QuestionCommentsRepository
  ) {}

  async handle({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseReq): Promise<CommentOnQuestionUseCaseRes> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }
    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    await this.questionCommentRepository.create(questionComment);

    return right({ questionComment });
  }
}
