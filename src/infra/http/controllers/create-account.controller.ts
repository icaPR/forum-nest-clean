import {
  BadRequestException,
  ConflictException,
  UsePipes,
} from "@nestjs/common";
import { Body, Controller, Post } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-students";
import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error";
import { Public } from "@/infra/auth/public";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller()
@Public()
export class CreateAccountController {
  constructor(private registerStudentUseCase: RegisterStudentUseCase) {}
  @Post("/accounts")
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body;

    const result = await this.registerStudentUseCase.handle({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
