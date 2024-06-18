import { BadRequestException, Body, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller()
export class CreateQuestionController {
  constructor(private createQuestionUseCase: CreateQuestionUseCase) {}
  @Post("/questions")
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.createQuestionUseCase.handle({
      authorId: userId,
      title,
      content,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
