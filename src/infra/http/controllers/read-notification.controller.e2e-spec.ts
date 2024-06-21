import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../../app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-questions";
import { NotificationFactory } from "test/factories/make-notifications";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Read notification - E2E", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let prisma: PrismaService;
  let notificationFactory: NotificationFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    notificationFactory = moduleRef.get(NotificationFactory);
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);
    await app.init();
  });

  test("[PATCH] /notifications/:notificationId/read", async () => {
    const user = await studentFactory.makePrismaStudent({ name: "user1" });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    });

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notification.id.toString()}/read`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    const notificationOnDataBase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    });

    expect(response.statusCode).toBe(204);
    expect(notificationOnDataBase?.readAt).not.toBeNull();
  });
});
