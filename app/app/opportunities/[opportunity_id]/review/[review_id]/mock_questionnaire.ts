import { Question } from "@lib/types/question";

export const QuestionaireData: Question[] = [
  {
    label:
      "TUM.ai is not responsible for integrating your stay into your degree, even if the project is labeled a thesis. Turning this into a thesis at your university is your responsibility. 📝",
    type: "CHECKBOXES",
    options: [
      {
        id: "c4a618da-60e3-4e81-829d-91ff1b2da976",
        text: "Understood",
      },
    ],
  },
  {
    type: "INPUT_TEXT",
    label: "First Name",
  },
  {
    label:
      "Status at TUM.ai (advisors are considered alumni) - no advantage or disadvantage to this 😊",
    type: "DROPDOWN",
    options: [
      {
        id: "fbc120f1-92d7-461f-bbb5-9133d4fb0e9e",
        text: "Active Member",
      },
      {
        id: "fe80e6c2-e72e-4ed5-a2ff-709d672c2696",
        text: "Alumni",
      },
    ],
  },
];
