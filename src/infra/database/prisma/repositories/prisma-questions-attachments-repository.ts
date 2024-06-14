import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionAttachmentRepository
  implements QuestionAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const attachment = await this.prisma.attachment.findMany({
      where: { id: questionId },
    });

    return attachment.map(PrismaQuestionAttachmentMapper.toDomain);
  }
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id: questionId.toString() },
    });
  }
}
