import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-object/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-object/slug";
import {
  Question as PrismaComment,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionDetails = PrismaComment & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.authorId),
      title: raw.title,
      content: raw.content,
      author: raw.author.name,
      slug: Slug.create(raw.slug),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
