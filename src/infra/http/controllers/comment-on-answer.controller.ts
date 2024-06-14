import { BadRequestException, Body, Param, UseGuards } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

@Controller()
export class CommentOnAnswerController {
  constructor(private commentOnAnswerUseCase: CommentOnAnswerUseCase) {}
  @Post("/answers/:answerId/comments")
  async handle(
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema))
    body: CommentOnAnswerBodySchema,
    @Param("answerId")
    answerId: string,
    @CurrentUser()
    user: TokenPayloadSchema
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnAnswerUseCase.handle({
      authorId: userId,
      content,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
