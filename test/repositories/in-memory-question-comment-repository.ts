import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-authr";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public item: QuestionComment[] = [];

  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}

  async create(questionComment: QuestionComment) {
    this.item.push(questionComment);
  }

  async findById(questionCommentId: string) {
    const question = this.item.find(
      (item) => item.id.toString() === questionCommentId
    );

    if (!question) {
      throw null;
    }

    return question;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = await this.item
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }
  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ) {
    const questionComments = this.item
      .filter((item) => item.questionId.toString() === questionId)
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

    return questionComments;
  }

  async delete(questionComment: QuestionComment) {
    const index = this.item.findIndex((item) => item.id === questionComment.id);

    this.item.splice(index, 1);
  }
}
