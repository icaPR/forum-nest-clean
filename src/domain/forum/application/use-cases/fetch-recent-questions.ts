import { Either, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { QuestionsRepository } from "../repositories/questions-repository";

interface FetchRecentQuestionsUseCaseReq {
  page: number;
}

type FetchRecentQuestionsUseCaseRes = Either<
  {
    questions: Question[];
  },
  null
>;

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async handle({
    page,
  }: FetchRecentQuestionsUseCaseReq): Promise<FetchRecentQuestionsUseCaseRes> {
    const questions = await this.questionsRepository.findManyRecent({ page });

    return right({ questions });
  }
}
