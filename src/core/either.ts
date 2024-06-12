export class Right<R, L> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isRight(): this is Right<R, L> {
    return true;
  }
  isLeft(): this is Left<R, L> {
    return false;
  }
}

export class Left<R, L> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isRight(): this is Right<R, L> {
    return false;
  }
  isLeft(): this is Left<R, L> {
    return true;
  }
}

export type Either<R, L> = Right<R, L> | Left<R, L>;

export const right = <R, L>(value: R): Either<R, L> => {
  return new Right(value);
};

export const left = <R, L>(value: L): Either<R, L> => {
  return new Left(value);
};
