import { Injectable } from "@nestjs/common";
import { CacheRepository } from "../cache-repository";
import { RedisServide } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisServide) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, "EX", 60 * 10);
  }
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
