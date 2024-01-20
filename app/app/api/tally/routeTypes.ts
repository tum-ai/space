import mime from "mime-types";

export type ParsedFormData = {
  responseId: string;
  submissionId: string;
  respondentId: string;
  formId: string;
  formName: string;
  createdAt: Date;
  fields: FormField[];
};

export type FormField = {
  key: string;
  label: string;
  type:
    | "HIDDEN_FIELDS"
    | "CALCULATED_FIELDS"
    | "INPUT_TEXT"
    | "INPUT_NUMBER"
    | "INPUT_EMAIL"
    | "INPUT_PHONE_NUMBER"
    | "INPUT_LINK"
    | "INPUT_DATE"
    | "INPUT_TIME"
    | "TEXTAREA"
    | "MULTIPLE_CHOICE"
    | "CHECKBOXES"
    | "DROPDOWN"
    | "MULTI_SELECT"
    | "FILE_UPLOAD"
    | "PAYMENT"
    | "RATING"
    | "RANKING"
    | "LINEAR_SCALE"
    | "SIGNATURE"
    | "MATRIX";
  value:
    | number
    | string
    | boolean
    | URL
    | string[]
    | FileUploadValue[]
    | MatrixValue;
  options?: IdTextPair[];
  rows?: IdTextPair[];
  columns?: IdTextPair[];
};

const mimeTypes = Object.keys(mime.extensions);

export type FileUploadValue = {
  id: string;
  name: string;
  url: URL;
  mimeType: typeof mimeTypes;
  size: number;
};

export type MatrixValue = {
  [key: string]: string[];
};

export type IdTextPair = {
  id: string;
  text: string;
};

export type LabelTextPair = {
  [label: string]: string | string[] | LabelTextPair;
};
