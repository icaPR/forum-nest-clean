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

  async createMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const attachment = await this.prisma.attachment.findMany({
      where: { questionId },
    });

    return attachment.map(PrismaQuestionAttachmentMapper.toDomain);
  }
  async deleteMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const attachmentsId = attachments.map((attachment) => {
      return attachment.id.toString();
    });

    await this.prisma.attachment.deleteMany({
      where: { id: { in: attachmentsId } },
    });
  }
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id: questionId.toString() },
    });
  }
}
