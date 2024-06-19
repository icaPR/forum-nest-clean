import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerComment } from "../../enterprise/entities/answer-comment";
import { CommentWithAuthor } from "../../enterprise/entities/value-object/comment-with-authr";

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>;
  abstract findById(answerId: string): Promise<AnswerComment | null>;
  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]>;
  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ): Promise<CommentWithAuthor[]>;
  abstract delete(answerComment: AnswerComment): Promise<void>;
}
