import { BadRequestException, Delete, HttpCode, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

@Controller()
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase) {}
  @Delete("/answers/comments/:answerCommentId")
  @HttpCode(204)
  async handle(
    @Param("answerCommentId") answerCommentId: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerCommentUseCase.handle({
      answerCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
