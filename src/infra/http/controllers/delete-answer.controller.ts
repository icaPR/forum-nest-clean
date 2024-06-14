import { BadRequestException, Delete, HttpCode, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";

@Controller()
export class DeleteAnswerController {
  constructor(private deleteAnswerUseCase: DeleteAnswerUseCase) {}
  @Delete("/answers/:id")
  @HttpCode(204)
  async handle(
    @Param("id") answerId: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const userId = user.sub;

    const result = await this.deleteAnswerUseCase.handle({
      answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
