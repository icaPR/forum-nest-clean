import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AnswerAttachmentRepository } from "@/domain/forum/application/repositories/answer-attachment-repository";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaAnswersRepository implements AnswerRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentRepository: AnswerAttachmentRepository
  ) {}

  async create(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.create({ data });

    await this.answerAttachmentRepository.createMany(
      answer.attachments.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(answerId: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });
    if (!answer) {
      return null;
    }
    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({ where: { id: answer.id.toString() } });
  }
  async save(answer: Answer): Promise<void> {
    const data = PrismaAnswerMapper.toPrisma(answer);
    await this.prisma.answer.update({ where: { id: data.id }, data });

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: answer.id.toString(),
        },
        data,
      }),
      await this.answerAttachmentRepository.createMany(
        answer.attachments.getNewItems()
      ),
      await this.answerAttachmentRepository.deleteMany(
        answer.attachments.getRemovedItems()
      ),
    ]);
    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
