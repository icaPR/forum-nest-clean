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
import { AnswerPresenter } from "../presenters/answer-presenter";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { CommentPresenter } from "../presenters/comment-presenter";
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
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase) {}
  @Get("/answers/:answerId/comments")
  async handle(
    @Query("page", queryValidateSchema) page: QueryParamSchema,
    @Param("answerId") answerId: string
  ) {
    const result = await this.fetchAnswerCommentsUseCase.handle({
      answerId,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments;

    return { comments: comments.map(CommentWithAuthorPresenter.toHttp) };
  }
}
