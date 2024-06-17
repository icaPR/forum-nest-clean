import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public item: AnswerComment[] = [];

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
