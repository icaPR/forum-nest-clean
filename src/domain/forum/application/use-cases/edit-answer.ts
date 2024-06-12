import { Either, left, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswerRepository } from "../repositories/answers-repository";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list";
import { AnswerAttachmentRepository } from "../repositories/answer-attachment-repository";

interface EditAnswerUseCaseReq {
  answerId: string;
  authorId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseRes = Either<
  {
    answer: Answer;
  },
  ResourceNotFoundError | NotAllowedError
>;

export class EditAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private answerAttachmentRepository: AnswerAttachmentRepository
  ) {}

  async handle({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseReq): Promise<EditAnswerUseCaseRes> {
    const answer = await this.answerRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }
    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedError());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentRepository.findManyByAnswerId(answerId);

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments
    );
    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      });
    });
    answerAttachmentList.update(answerAttachments);
    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answerRepository.save(answer);

    return right({ answer });
  }
}
