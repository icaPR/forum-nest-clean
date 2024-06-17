import { Uploader } from "@/domain/forum/application/storage/uploader";
import { R2Storage } from "./r2-storage";
import { EnvModule } from "../env/env.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [EnvModule],
  providers: [{ provide: Uploader, useClass: R2Storage }],
  exports: [Uploader],
})
export class StorageModule {}
