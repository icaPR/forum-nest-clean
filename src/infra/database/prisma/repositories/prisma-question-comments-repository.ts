import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";

@Injectable()
export class PrismaQuestionsCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(questionComment: QuestionComment): Promise<void> {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);
    await this.prisma.comment.create({ data });
  }
  async findById(questionId: string): Promise<QuestionComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: questionId },
    });
    if (!comment) {
      return null;
    }
    return PrismaQuestionCommentMapper.toDomain(comment);
  }
  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ): Promise<QuestionComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });
    return comments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: questionComment.id.toString() },
    });
  }
}
