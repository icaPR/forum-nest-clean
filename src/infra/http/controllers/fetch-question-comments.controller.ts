import { BadRequestException, Get, Param, Query } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type QueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidateSchema = new ZodValidationPipe(pageQueryParamSchema);

@Controller()
export class FetchQuestionCommentsController {
  constructor(
    private fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase
  ) {}
  @Get("/questions/:questionId/comments")
  async handle(
    @Query("page", queryValidateSchema) page: QueryParamSchema,
    @Param("questionId") questionId: string
  ) {
    const result = await this.fetchQuestionCommentsUseCase.handle({
      questionId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return { comments: comments.map(CommentWithAuthorPresenter.toHttp) };
  }
}
