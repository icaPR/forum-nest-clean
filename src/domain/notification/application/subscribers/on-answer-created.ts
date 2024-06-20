import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";

import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handleSendNewAnserNotification.bind(this),
      AnswerCreatedEvent.name
    );
  }

  private async handleSendNewAnserNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString()
    );

    if (question) {
      await this.sendNotificationUseCase.handle({
        recipientId: question.authorId.toString(),
        title: "New answer",
        content: answer.excerpt,
      });
    }
  }
}
