import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { Prisma } from "@prisma/client";

export class PrismaAttachmentMapper {
  static toPrisma(raw: Attachment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      title: raw.title,
      url: raw.url,
    };
  }
}
