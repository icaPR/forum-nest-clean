import { Get, Query, UseGuards } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";
import { PrismaService } from "@/prisma/prisma.service";
import { z } from "zod";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

type QueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidateSchema = new ZodValidationPipe(pageQueryParamSchema);

@Controller()
@UseGuards(AuthGuard("jwt"))
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}
  @Get("/questions")
  async handle(@Query("page", queryValidateSchema) page: QueryParamSchema) {
    console.log(page);
    const questions = await this.prisma.question.findMany({
      take: 20,
      skip: (page - 1) * 1,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { questions };
  }
}
