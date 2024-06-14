import { BadRequestException, Delete, HttpCode, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";

@Controller()
export class DeleteQuestionController {
  constructor(private deleteQuestionUseCase: DeleteQuestionUseCase) {}
  @Delete("/questions/:id")
  @HttpCode(204)
  async handle(
    @Param("id") questionId: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestionUseCase.handle({
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
