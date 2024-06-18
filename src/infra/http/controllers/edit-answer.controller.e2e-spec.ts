import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-questions";
import { StudentFactory } from "test/factories/make-student";

describe("Edit answers controller - E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[PUT] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();
    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    });
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment2.id,
    });

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "new content",
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    const answerDatabase = await prisma.answer.findFirst({
      where: { content: "new content" },
    });

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerDatabase?.id,
      },
    });

    expect(response.statusCode).toBe(204);
    expect(answerDatabase).toBeTruthy();
    expect(attachmentsOnDatabase).toHaveLength(2);
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ])
    );
  });
});
