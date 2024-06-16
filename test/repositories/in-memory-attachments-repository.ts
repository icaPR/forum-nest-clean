import { AttachmentsRepository } from "@/domain/forum/application/repositories/attachments-repository";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment";

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public item: Attachment[] = [];

  async create(attachment: Attachment) {
    this.item.push(attachment);
  }
}
