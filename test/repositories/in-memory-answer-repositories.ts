import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswerRepository implements AnswerRepository {
  public item: Answer[] = [];

  constructor(private answerAttachmentRepository: AnswerAttachmentRepository) {}

  async create(answer: Answer) {
    this.item.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
  async findById(answerId: string) {
    const answer = this.item.find((item) => item.id.toString() === answerId);

    if (!answer) {
      throw null;
    }

    return answer;
  }
  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.item
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return answers;
  }

  async save(answer: Answer) {
    const index = this.item.findIndex((item) => item.id === answer.id);

    this.item[index] = answer;
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
  async delete(answer: Answer) {
    const index = this.item.findIndex((item) => item.id === answer.id);

    this.item.splice(index, 1);

    this.answerAttachmentRepository.deleteManyByAnswerId(answer.id.toString());
  }
}
