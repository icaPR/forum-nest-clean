import { Body, UseGuards, UsePipes } from "@nestjs/common";
import { Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { CurrentUser } from "@/infra/auth/current-user-decoratort";
import { TokenPayloadSchema } from "@/infra/auth/jwt.strategy";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller()
@UseGuards(AuthGuard("jwt"))
export class CreateQuestionController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  @Post("/questions")
  async handle(
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: TokenPayloadSchema
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });

    return "ok";
  }

  private convertToSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
}
