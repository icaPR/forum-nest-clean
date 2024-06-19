import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Injectable } from "@nestjs/common";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaService } from "../prisma.service";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}
  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams
  ) {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });
    return comments.map(PrismaCommentWithAuthorMapper.toDomain);
  }

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);
    await this.prisma.comment.create({ data });
  }
  async findById(answerId: string): Promise<AnswerComment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: answerId },
    });
    if (!comment) {
      return null;
    }
    return PrismaAnswerCommentMapper.toDomain(comment);
  }
  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ): Promise<AnswerComment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });
    return comments.map(PrismaAnswerCommentMapper.toDomain);
  }
  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: answerComment.id.toString() },
    });
  }
}
