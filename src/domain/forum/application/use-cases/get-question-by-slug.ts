import { QuestionsRepository } from "../repositories/questions-repository";
import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-object/question-details";

interface GetQuestionBySlugUseCaseReq {
  slug: string;
}

type GetQuestionBySlugUseCaseRes = Either<
  {
    question: QuestionDetails;
  },
  ResourceNotFoundError
>;
@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async handle({
    slug,
  }: GetQuestionBySlugUseCaseReq): Promise<GetQuestionBySlugUseCaseRes> {
    const question = await this.questionsRepository.findDetailsBySlug(slug);
    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({ question });
  }
}
