import { BadRequestException, Get, Param } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { QuestionPresenter } from "../presenters/question-presenter";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";

@Controller()
export class GetQuestionBySlugController {
  constructor(private getQuestionBySlugUseCase: GetQuestionBySlugUseCase) {}
  @Get(`/questions/:slug`)
  async handle(@Param("slug") slug: string) {
    const result = await this.getQuestionBySlugUseCase.handle({ slug });

    if (result.isLeft()) {
      throw new BadRequestException(result);
    }

    const question = result.value.question;

    return { questions: QuestionPresenter.toHttp(result.value.question) };
  }
}
