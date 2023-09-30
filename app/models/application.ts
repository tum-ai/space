import { Review } from "./review";
import { TallyField } from "./tally";

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
