export interface Review {
  id: number;
  reviewer: any;
  finalscore: number;
  application: Application;
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
