import {
  BadRequestException,
  Get,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { QuestionPresenter } from "../presenters/question-presenter";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { AnswerPresenter } from "../presenters/answer-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type QueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidateSchema = new ZodValidationPipe(pageQueryParamSchema);

@Controller()
export class FetchQuestionAnswersController {
  constructor(
    private fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase
  ) {}
  @Get("/questions/:questionId/answers")
  async handle(
    @Query("page", queryValidateSchema) page: QueryParamSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.fetchQuestionAnswersUseCase.handle({
      questionId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers;

    return { answers: answers.map(AnswerPresenter.toHttp) };
  }
}
