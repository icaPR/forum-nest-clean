import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  public item: QuestionAttachment[] = [];

  async createMany(attachments: QuestionAttachment[]) {
    this.item.push(...attachments);
  }
  async deleteMany(attachments: QuestionAttachment[]) {
    const questionAttachment = this.item.filter((item) => {
      return !attachments.some((attachments) => attachments.equals(item));
    });
    this.item = questionAttachment;
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachment = this.item.filter(
      (item) => item.questionId.toString() === questionId
    );

    return questionAttachment;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachment = this.item.filter(
      (item) => item.questionId.toString() !== questionId
    );

    this.item = questionAttachment;
  }
}
