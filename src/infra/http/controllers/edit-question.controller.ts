import {
  BadRequestException,
  Body,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller()
export class EditQuestionController {
  constructor(private editQuestionUseCase: EditQuestionUseCase) {}
  @Put("/questions/:id")
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editQuestionBodySchema))
    body: EditQuestionBodySchema,
    @Param("id") questionId: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestionUseCase.handle({
      authorId: userId,
      title,
      content,
      attachmentsIds: [],
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
