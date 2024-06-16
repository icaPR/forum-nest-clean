import { QuestionFactory } from "test/factories/make-questions";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { StudentFactory } from "test/factories/make-student";

describe("Delete answer comment controller - E2E", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let answerCommentFactory: AnswerCommentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        AnswerCommentFactory,
        QuestionFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentFactory);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[DELETE] /answers/comments/:answerCommentId", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const comment = await answerCommentFactory.makePrismaComment({
      answerId: answer.id,
      authorId: user.id,
    });

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${comment.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    const commentDatabase = await prisma.comment.findUnique({
      where: { id: comment.id.toString() },
    });
    expect(response.statusCode).toBe(204);
    expect(commentDatabase).toBeNull();
  });
});
