import { BadRequestException, Get, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { QuestionDetailsPresenter } from "../presenters/question-details-presenter";

@Controller()
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlugUseCase: GetQuestionBySlugUseCase) {}
  @Get(`/questions/:slug`)
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlugUseCase.handle({ slug });

    if (result.isLeft()) {
      throw new BadRequestException(result);
    }

    return {
      question: QuestionDetailsPresenter.toHttp(result.value.question),
    };
  }
}
