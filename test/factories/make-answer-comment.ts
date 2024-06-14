import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  AnswerComment,
  AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentProps } from "@/domain/forum/enterprise/entities/comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID
) {
  const answer = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id
  );
  return answer;
}

@Injectable()
export class CommentFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaComment(
    data: Partial<CommentProps> = {}
  ): Promise<AnswerComment> {
    const answerComment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    });
    return answerComment;
  }
}
