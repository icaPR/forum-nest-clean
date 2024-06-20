import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-object/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
  static toHttp(questiondetails: QuestionDetails) {
    return {
      questionId: questiondetails.questionId.toString(),
      authorId: questiondetails.authorId.toString(),
      authorName: questiondetails.author,
      title: questiondetails.title,
      slug: questiondetails.slug,
      bestAnswerId: questiondetails.bestAnswerId,
      content: questiondetails.content,
      attachments: questiondetails.attachments.map(AttachmentPresenter.toHttp),
      createdAt: questiondetails.createdAt,
      updatedAt: questiondetails.updatedAt,
    };
  }
}
