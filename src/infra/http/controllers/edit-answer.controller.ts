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
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";

const editAnswerBodySchema = z.object({
  content: z.string(),
});

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller()
export class EditAnswerController {
  constructor(private editAnswerUseCase: EditAnswerUseCase) {}
  @Put("/answers/:id")
  @HttpCode(204)
  async handle(
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    body: EditAnswerBodySchema,
    @Param("id") answerId: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswerUseCase.handle({
      authorId: userId,
      answerId,
      content,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
