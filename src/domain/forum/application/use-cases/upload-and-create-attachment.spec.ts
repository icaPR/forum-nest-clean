import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { FakeUploader } from "test/storage/faker-uploader";
import { InvalidAttachmentType } from "./errors/invalid-attachment.type";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and craete attachment", async () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const result = await sut.handle({
      fileName: "attachment.png",
      fileType: "image/png",
      body: Buffer.from(""),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.item[0],
    });
    expect(fakeUploader.uploads).toHaveLength(1);
  });

  it("should not be able to upload an attachment with invalid file type", async () => {
    const result = await sut.handle({
      fileName: "attachment.png",
      fileType: "image/pngg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
