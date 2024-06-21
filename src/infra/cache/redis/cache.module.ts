import { EnvModule } from "@/infra/env/env.module";
import { EnvService } from "@/infra/env/env.service";
import { Module } from "@nestjs/common";
import { CacheRepository } from "../cache-repository";
import { RedisCacheRepository } from "./redis-cache-repository";
import { RedisServide } from "./redis.service";

@Module({
  imports: [EnvModule],
  providers: [
    RedisServide,
    {
      provide: CacheRepository,
      useClass: RedisCacheRepository,
    },
  ],

  exports: [CacheRepository],
})
export class CacheModule {}
