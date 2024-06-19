import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-authr";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public item: AnswerComment[] = [];

  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams
  ) {
    const answerComments = this.item
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map((comment) => {
        const author = this.inMemoryStudentsRepository.item.find((student) => {
          return student.id.equals(comment.authorId);
        });

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toString()} does not exist."`
          );
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        });
      });

    return answerComments;
  }

  async create(answerComment: AnswerComment) {
    this.item.push(answerComment);
  }
  async findById(answerCommentId: string) {
    const answer = this.item.find(
      (item) => item.id.toString() === answerCommentId
    );

    if (!answer) {
      throw null;
    }

    return answer;
  }
  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = await this.item
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async delete(answerComment: AnswerComment) {
    const index = this.item.findIndex((item) => item.id === answerComment.id);

    this.item.splice(index, 1);
  }
}
