import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswerRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { SendNotificationUseCase } from "../use-cases/send-notification";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswerRepository,
    private sendNotificationUseCase: SendNotificationUseCase
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handleQuestionBestNotification.bind(this),
      QuestionBestAnswerChosenEvent.name
    );
  }

  private async handleQuestionBestNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(
      bestAnswerId.toString()
    );

    if (answer) {
      await this.sendNotificationUseCase.handle({
        recipientId: answer.authorId.toString(),
        title: "Your answer has been chosen",
        content: `Your answer was "${question.title.substring(
          0,
          10
        )} and was chosen as best`,
      });
    }
  }
}
