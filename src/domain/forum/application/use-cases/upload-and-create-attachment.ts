import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { InvalidAttachmentType } from "./errors/invalid-attachment.type";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { Attachment } from "../../enterprise/entities/attachment";
import { Uploader } from "../storage/uploader";

interface UploadAndCreateAttachmentUseCaseReq {
  fileName: string;
  fileType: string;
  body: Buffer;
}

type UploadAndCreateAttachmentUseCaseRes = Either<
  {
    attachment: Attachment;
  },
  InvalidAttachmentType
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader
  ) {}

  async handle({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseReq): Promise<UploadAndCreateAttachmentUseCaseRes> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType));
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({ attachment });
  }
}
