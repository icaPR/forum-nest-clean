import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import "dotenv/config";
import { execSync } from "node:child_process";
import { config } from "dotenv";
import { DomainEvents } from "@/core/events/domain-events";
import { envSchema } from "@/infra/env/env";
import Redis from "ioredis";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const env = envSchema.parse(process.env);

const prisma = new PrismaClient();
const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
});

function generateUniqueDataBaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error("Please provider a DATABASE_URL environment variable");
  }
  const url = new URL(env.DATABASE_URL);
  url.searchParams.set("schema", schemaId);

  return url.toString();
}
const schemaId = randomUUID();

beforeAll(async () => {
  DomainEvents.shouldRun = false;

  const databaseURL = generateUniqueDataBaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;

  await redis.flushdb();

  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);
  await prisma.$disconnect;
});
