import { Review } from "./review";

export interface Application {
  id: number;
  reviews: Review[];
  submission: {
    data: {
      formName: string;
      createdAt: any;
      fields: any[];
    };
  };
}
