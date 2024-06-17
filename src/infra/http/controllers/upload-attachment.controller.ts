import { InvalidAttachmentType } from "@/domain/forum/application/use-cases/errors/invalid-attachment.type";
import { UploadAndCreateAttachmentUseCase } from "./../../../domain/forum/application/use-cases/upload-and-create-attachment";
import {
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase
  ) {}
  @Post("/attachments")
  @UseInterceptors(FileInterceptor("file"))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: ".(png|jpg|jpeg|pdf)",
          }),
        ],
      })
    )
    file: Express.Multer.File
  ) {
    const result = await this.uploadAndCreateAttachmentUseCase.handle({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAttachmentType:
          throw new BadRequestException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { attachment } = result.value;

    return { attachmentId: attachment.id.toString() };
  }
}
