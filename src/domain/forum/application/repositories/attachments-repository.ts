import { Attachment } from "../../enterprise/entities/attachment";

export abstract class AttachmentsRepository {
  abstract create(atachment: Attachment): Promise<void>;
}
