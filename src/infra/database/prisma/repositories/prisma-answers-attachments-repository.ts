import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentRepository
  implements AnswerAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachment = await this.prisma.attachment.findMany({
      where: { id: answerId },
    });

    return attachment.map(PrismaAnswerAttachmentMapper.toDomain);
  }
  async deleteManyByAnswerId(answerId: string): Promise<void> {
    await this.prisma.attachment.delete({
      where: { id: answerId.toString() },
    });
  }
}
