import { AttachmentFactory } from "test/factories/make-attachment";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DatabaseModule } from "@/infra/database/database.module";
import { StudentFactory } from "test/factories/make-student";
import { QuestionFactory } from "test/factories/make-questions";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { AppModule } from "@/infra/app.module";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/redis/cache.module";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

describe("Prisma questions repository - E2E", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let cacheRepository: CacheRepository;
  let questionsRepository: QuestionsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
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
    cacheRepository = moduleRef.get(CacheRepository);
    questionsRepository = moduleRef.get(QuestionsRepository);

    await app.init();
  });

  it("should cache question deteails", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment({});

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    if (!cached) {
      throw new Error();
    }
    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toValue(),
      })
    );
  });

  it("should return cashed question deteails on subsequent calls", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment({});

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    let cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();

    await questionsRepository.findDetailsBySlug(slug);

    cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).not.toBeNull();

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    if (!cached) {
      throw new Error();
    }
    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toValue(),
      })
    );
  });

  it("should reset question deteails cache when saving the question", async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment({});

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true })
    );

    await questionsRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
