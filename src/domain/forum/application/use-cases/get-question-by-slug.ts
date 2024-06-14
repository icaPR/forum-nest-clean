import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";

interface GetQuestionBySlugUseCaseReq {
  slug: string;
}

type GetQuestionBySlugUseCaseRes = Either<
  {
    question: Question;
  },
  ResourceNotFoundError
>;
@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async handle({
    slug,
  }: GetQuestionBySlugUseCaseReq): Promise<GetQuestionBySlugUseCaseRes> {
    const question = await this.questionsRepository.findBySlug(slug);
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
