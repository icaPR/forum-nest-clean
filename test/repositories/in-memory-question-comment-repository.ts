import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public item: QuestionComment[] = [];

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

  async delete(questionComment: QuestionComment) {
    const index = this.item.findIndex((item) => item.id === questionComment.id);

    this.item.splice(index, 1);
  }
}
