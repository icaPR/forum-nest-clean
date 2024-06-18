import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Create answer question controller - E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[POST] /questions/:questionId/answers", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      title: "question1",
    });

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/answers`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "new content",
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      });

    const answerDatabase = await prisma.answer.findFirst({
      where: { content: "new content" },
    });

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerDatabase?.id,
      },
    });

    expect(response.statusCode).toBe(201);
    expect(answerDatabase).toBeTruthy();
    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
