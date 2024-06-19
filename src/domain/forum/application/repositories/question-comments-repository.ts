import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-object/comment-with-authr";

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>;
  abstract findById(questionId: string): Promise<QuestionComment | null>;
  abstract findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]>;
  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>;
  abstract delete(questionComment: QuestionComment): Promise<void>;
}
