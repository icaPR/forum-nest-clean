import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    throw new Error("Method not implemented.");
  }
  deleteManyByAnswerId(answerId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
