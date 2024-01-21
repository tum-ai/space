export type Answer = string | number | Answer[];

export interface Question {
  id: number;
  question: string;
  answer: Answer;
  options?: Answer[];
}
