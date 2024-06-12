export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(text: string) {
    return new Slug(text);
  }

  static createFromText(text: string) {
    const slugText = text
      .normalize("NFKD")
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "");

    return new Slug(slugText);
  }
}
