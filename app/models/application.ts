export interface Review {}

export interface Application {
  id: number;
  reviews: Review[];
  submission: {
    data: {
      formName: string;
    };
  };
}
