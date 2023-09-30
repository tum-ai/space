import { Review } from "./review";

export interface TallyFileUpload {
  id: string;
  mimeType: string;
  name: string;
  url: string;
}
export interface TallyField {
  key: string;
  value?: string | string[] | TallyFileUpload[];
  label?: string;
  options?: { id: string; text: string }[];
  type:
    | "CHECKBOXES"
    | "INPUT_TEXT"
    | "INPUT_EMAIL"
    | "INPUT_PHONE_NUMBER"
    | "DROPDOWN"
    | "INPUT_DATE"
    | "FILE_UPLOAD"
    | "INPUT_LINK"
    | "MULTIPLE_CHOICE"
    | "INPUT_NUMBER"
    | "TEXTAREA";
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
