import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-questions-repository";
import { PrismaQuestionAttachmentRepository } from "./prisma/repositories/prisma-questions-attachments-repository";
import { PrismaQuestionsCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaAnswersRepository } from "./prisma/repositories/prisma-answers-repository";
import { PrismaAnswerAttachmentRepository } from "./prisma/repositories/prisma-answers-attachments-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

@Module({
  providers: [
    PrismaService,
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    PrismaQuestionAttachmentRepository,
    PrismaQuestionsCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    PrismaQuestionAttachmentRepository,
    PrismaQuestionsCommentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerAttachmentRepository,
    PrismaAnswerCommentsRepository,
  ],
})
export class DatabaseModule {}
