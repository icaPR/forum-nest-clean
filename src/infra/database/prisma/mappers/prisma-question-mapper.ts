import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Slug } from "@/domain/forum/enterprise/entities/value-object/slug";
import { Question as PrismaQuestion, Prisma } from "@prisma/client";

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        title: raw.title,
        content: raw.content,
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    );
  }
  static toPrisma(raw: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      authorId: raw.authorId.toString(),
      title: raw.title,
      content: raw.content,
      bestAnswerId: raw.bestAnswerId?.toString(),
      slug: raw.slug.value,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}
