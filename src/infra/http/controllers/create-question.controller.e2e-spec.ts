import { Attachment } from "@/domain/forum/enterprise/entities/attachment";
import { AttachmentFactory } from "./../../../../test/factories/make-attachment";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { StudentFactory } from "test/factories/make-student";

describe("Create question controller - E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    studentFactory = moduleRef.get(StudentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[POST] /questions", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .post("/questions")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "question test",
        content: "new content",
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    const questionDatabase = await prisma.question.findFirst({
      where: { content: "new content" },
    });

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionDatabase?.id,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(questionDatabase).toBeTruthy();
    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
