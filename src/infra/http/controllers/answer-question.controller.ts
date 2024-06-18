import { BadRequestException, Body, Param } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller()
export class AnswerQuestionController {
  constructor(private answerQuestionUseCase: AnswerQuestionUseCase) {}
  @Post("/questions/:questionId/answers")
  async handle(
    @Body(new ZodValidationPipe(answerQuestionBodySchema))
    body: AnswerQuestionBodySchema,
    @Param("questionId")
    questionId: string,
    @CurrentUser()
    user: TokenPayloadSchema
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.answerQuestionUseCase.handle({
      authorId: userId,
      content,
      attachmentsIds: attachments,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
