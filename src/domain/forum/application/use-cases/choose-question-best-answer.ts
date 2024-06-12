import { Either, left, right } from "@/core/either";
import { Question } from "../../enterprise/entities/question";
import { AnswerRepository } from "../repositories/answers-repository";
import { QuestionsRepository } from "../repositories/questions-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

interface ChooseQuestionBestAnswerUseCaseReq {
  answerId: string;
  authorId: string;
}

type ChooseQuestionBestAnswerUseCaseRes = Either<
  {
    question: Question;
  },
  ResourceNotFoundError | NotAllowedError
>;
export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answerRepository: AnswerRepository
  ) {}

  async handle({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseReq): Promise<ChooseQuestionBestAnswerUseCaseRes> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    const question = await this.questionsRepository.findById(
      answer.questionId.toValue()
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({ question });
  }
}
