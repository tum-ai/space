import { Review } from "./review";

export interface TallyField {
  label?: string;
  value?: string;
}
export interface Application {
  id: number;
  reviews: Review[];
  submission: {
    data: {
      formName: string;
      createdAt: any;
      fields: TallyField[];
    };
  };
}
