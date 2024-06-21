import { BadRequestException, Patch, HttpCode, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { QuestionDetailsPresenter } from "../presenters/question-details-presenter";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notifications";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";

@Controller()
export class ReadNotificationController {
  constructor(private readNotificationUseCase: ReadNotificationUseCase) {}
  @Patch(`/notifications/:notificationId/read`)
  @HttpCode(204)
  async handle(
    @CurrentUser() user: TokenPayloadSchema,
    @Param("notificationId") notificationId: string
  ) {
    const result = await this.readNotificationUseCase.handle({
      notificationId,
      recipientId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
