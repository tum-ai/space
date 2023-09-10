export interface Review {
  reviewer: any;
  finalscore: number;
}

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
