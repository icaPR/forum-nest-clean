import {
  UploadParams,
  Uploader,
} from "@/domain/forum/application/storage/uploader";

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = await fileName.concat(".com");

    this.uploads.push({
      fileName,
      url,
    });

    return { url };
  }
}
