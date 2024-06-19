import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-authr";

export class CommentWithAuthorPresenter {
  static toHttp(comment: CommentWithAuthor) {
    return {
      id: comment.commentId.toString(),
      contentId: comment.authorId.toString(),
      authorName: comment.author,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
