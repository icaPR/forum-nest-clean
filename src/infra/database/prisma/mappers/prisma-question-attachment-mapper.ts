import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) {
      throw new Error("Invalid attachment type");
    }
    return QuestionAttachment.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        questionId: new UniqueEntityID(raw.questionId),
      },
      new UniqueEntityID(raw.id)
    );
  }
  static toPrismaUpdateMany(
    raw: QuestionAttachment[]
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsId = raw.map((attachment) => {
      return attachment.attachmentId.toString();
    });

    return {
      where: {
        id: {
          in: attachmentsId,
        },
      },
      data: {
        questionId: raw[0].questionId.toString(),
      },
    };
  }
}
