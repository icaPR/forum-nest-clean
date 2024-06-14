import { BadRequestException, Delete, HttpCode, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";

@Controller()
export class DeleteQuestionCommentController {
  constructor(
    private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase
  ) {}
  @Delete("/questions/comments/:questionCommentId")
  @HttpCode(204)
  async handle(
    @Param("questionCommentId") questionCommentId: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionCommentUseCase.handle({
      questionCommentId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
