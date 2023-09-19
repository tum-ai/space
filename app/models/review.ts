// This is just a generic filler interface to ensure type safety for

import { Application } from "./application";

// more specific form types that inherit from it
export interface ReviewForm {}

export interface Review {
  form: any;
  id: number;
  reviewer: any;
  finalscore: number;
  application: Application;
}
