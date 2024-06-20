import { DomainEvents } from "@/core/events/domain-events";
import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { InMemoryQuestionAttachmentRepository } from "./in-memory-question-attachment-repository";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-object/question-details";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public item: Question[] = [];

  constructor(
    private questionAttachmentRepository: InMemoryQuestionAttachmentRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository
  ) {}

  async findDetailsBySlug(slug: string) {
    const question = this.item.find((item) => item.slug.value === slug);

    if (!question) {
      throw new Error("Question not found");
    }

    const author = this.studentsRepository.item.find((student) => {
      return student.id.equals(question.authorId);
    });

    if (!author) {
      throw new Error("Author not found");
    }

    const questionAttachments = this.questionAttachmentRepository.item.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id);
      }
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.item.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId);
      });

      if (!attachment) {
        throw new Error("attachment not found");
      }

      return attachment;
    });
    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      bestAnswerId: question.bestAnswerId,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    });
  }

  async create(question: Question) {
    this.item.push(question);
    await this.questionAttachmentRepository.createMany(
      question.attachments.getItems()
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.item.find((item) => item.slug.value === slug);

    if (!question) {
      throw new Error("Question not found");
    }

    return question;
  }

  async findById(questionId: string) {
    const question = this.item.find(
      (item) => item.id.toString() === questionId
    );

    if (!question) {
      throw null;
    }

    return question;
  }
  async findManyRecent({ page }: PaginationParams) {
    const questions = this.item
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async save(question: Question) {
    const index = this.item.findIndex((item) => item.id === question.id);

    this.item[index] = question;

    await this.questionAttachmentRepository.createMany(
      question.attachments.getNewItems()
    );
    await this.questionAttachmentRepository.deleteMany(
      question.attachments.getRemovedItems()
    );
    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const index = this.item.findIndex((item) => item.id === question.id);

    this.item.splice(index, 1);

    this.questionAttachmentRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }
}
