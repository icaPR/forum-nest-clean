import { QuestionAttachmentRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private questionAttachmentRepository: QuestionAttachmentRepository
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.create({ data });

    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    );
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    });
    if (!question) {
      return null;
    }
    return PrismaQuestionMapper.toDomain(question);
  }
  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return null;
    }
    return PrismaQuestionMapper.toDomain(question);
  }
  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);
    await this.prisma.question.delete({ where: { id: data.id } });
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: question.id.toString(),
        },
        data,
      }),
      await this.questionAttachmentRepository.createMany(
        question.attachments.getNewItems()
      ),
      await this.questionAttachmentRepository.deleteMany(
        question.attachments.getRemovedItems()
      ),
    ]);
  }
}
