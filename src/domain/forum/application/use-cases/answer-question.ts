import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerRepository } from "../repositories/answers-repository";
import { Answer } from "../../enterprise/entities/answer";
import { Either, right } from "@/core/either";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { Injectable } from "@nestjs/common";

interface AnswerQuestionUseCaseReq {
  authorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type AnswerQuestionUseCaseRes = Either<{ answer: Answer }, null>;

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswerRepository) {}

  async handle({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseReq): Promise<AnswerQuestionUseCaseRes> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });
    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answerRepository.create(answer);
    return right({ answer });
  }
}
