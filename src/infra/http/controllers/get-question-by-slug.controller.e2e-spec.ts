import { AttachmentFactory } from "test/factories/make-attachment";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Slug } from "@/domain/forum/enterprise/entities/value-object/slug";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-questions";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";

describe("Get question by slug controller - E2E", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[GET] /questions/:slug", async () => {
    const user = await studentFactory.makePrismaStudent({ name: "user1" });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      title: "question1",
      authorId: user.id,
      slug: Slug.create("question1"),
    });
    const attachment = await attachmentFactory.makePrismaAttachment({
      title: "attachment1",
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/question1`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: "question1",
        authorName: "user1",
        attachments: [
          expect.objectContaining({
            title: "attachment1",
          }),
        ],
      }),
    });
  });
});
