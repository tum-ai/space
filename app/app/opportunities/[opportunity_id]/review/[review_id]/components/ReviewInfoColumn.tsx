"use client";

import InfoLabel from "./InfoLabel";

export default function ReviewInfoColumn({ application }) {
  const longText =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  return (
    <div className="grid h-[42rem] grid-cols-2 gap-4 overflow-y-auto rounded-md border-2 border-slate-600 p-4">
      <InfoLabel label="First Name" info={application.first_name}></InfoLabel>
      <InfoLabel label="First Name" info={application.last_name}></InfoLabel>
      <InfoLabel label="Nationality" info={application.nationality}></InfoLabel>
      <InfoLabel
        label="Date of Birth"
        info={application.date_of_birth}
      ></InfoLabel>
      <div className="col-span-2">
        <InfoLabel label="University" info={application.university}></InfoLabel>
      </div>
      <InfoLabel label="Degree" info={application.degree}></InfoLabel>
      <InfoLabel label="Semester" info={application.semester}></InfoLabel>
      <InfoLabel label="First Name" info={application.first_name}></InfoLabel>
      <InfoLabel label="First Name" info={application.last_name}></InfoLabel>
      <InfoLabel label="Nationality" info={application.nationality}></InfoLabel>
      <InfoLabel
        label="Date of Birth"
        info={application.date_of_birth}
      ></InfoLabel>
      <div className="col-span-2">
        <InfoLabel label="University" info={application.university}></InfoLabel>
      </div>
      <InfoLabel label="Degree" info={application.degree}></InfoLabel>
      <InfoLabel label="Test" info={application.semester}></InfoLabel>
      <div className="col-span-2">
        <InfoLabel
          label="Why do you want to join TUM.ai"
          info={longText}
        ></InfoLabel>
      </div>
      <InfoLabel label="Degree" info={application.degree}></InfoLabel>
      <InfoLabel label="Semester" info={application.semester}></InfoLabel>
    </div>
  );
}
