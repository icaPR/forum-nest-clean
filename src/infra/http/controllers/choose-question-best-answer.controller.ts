import { BadRequestException, HttpCode, Param, Patch } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";

@Controller()
export class ChooseQuestionBestAnswerController {
  constructor(
    private chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase
  ) {}
  @Patch("/answers/:answerId/choose-as-best")
  @HttpCode(204)
  async handle(
    @Param("answerId") answerId: string,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const userId = user.sub;

    const result = await this.chooseQuestionBestAnswerUseCase.handle({
      answerId: answerId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
