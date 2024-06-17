import { UploadAndCreateAttachmentUseCase } from "./../../domain/forum/application/use-cases/upload-and-create-attachment";
import { Module } from "@nestjs/common";
import { CreateAccountController } from "./controllers/create-account.controller";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FetchRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-students";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { AnswerQuestionController } from "./controllers/answer-question.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { EditAnswerController } from "./controllers/edit-answer.controller";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { DeleteAnswerController } from "./controllers/delete-answer.controller";
import { CommentOnQuestionController } from "./controllers/comment-on-question.controller";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { DeleteQuestionCommentController } from "./controllers/delete-question-comment.controller";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
import { CommentOnAnswerController } from "./controllers/comment-on-answer.controller";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { DeleteAnswerCommentController } from "./controllers/delete-answer-comment.controlller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";
import { ChooseQuestionBestAnswerController } from "./controllers/choose-question-best-answer.controller";
import { FetchQuestionAnswersController } from "./controllers/fetch-question-answers.controller";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { FetchQuestionCommentsController } from "./controllers/fetch-question-comments.controller";
import { FetchAnswerCommentsController } from "./controllers/fetch-answer-comments.controller";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { UploadAttachmentController } from "./controllers/upload-attachment.controller";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
    AnswerQuestionController,
    DeleteQuestionController,
    DeleteAnswerController,
    EditQuestionController,
    EditAnswerController,
    CommentOnQuestionController,
    CommentOnAnswerController,
    DeleteQuestionCommentController,
    DeleteAnswerCommentController,
    ChooseQuestionBestAnswerController,
    GetQuestionBySlugController,
    FetchAnswerCommentsController,
    FetchQuestionAnswersController,
    FetchQuestionCommentsController,
    UploadAttachmentController,
  ],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
    AnswerQuestionUseCase,
    DeleteQuestionUseCase,
    DeleteAnswerUseCase,
    EditQuestionUseCase,
    EditAnswerUseCase,
    CommentOnQuestionUseCase,
    CommentOnAnswerUseCase,
    DeleteQuestionCommentUseCase,
    DeleteAnswerCommentUseCase,
    ChooseQuestionBestAnswerUseCase,
    GetQuestionBySlugUseCase,
    FetchQuestionAnswersUseCase,
    FetchQuestionCommentsUseCase,
    FetchAnswerCommentsUseCase,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
