"use client";

import InfoLabel from "../review/components/InfoLabel";

export default function ReviewInfoColumn({ application }) {
  const mockData = {
    first_name: "Bryan",
    last_name: "Alvin",
    nationality: "Indonesian",
    date_of_birth: "08.11.2001",
    university: "Technical University of Munich",
    degree: "Informatik",
    semester: "5",
  };

  const longText =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  return (
    <div className="grid h-[42rem] grid-cols-2 gap-4 overflow-y-auto rounded-md border-2 border-slate-600 p-4">
      <InfoLabel label="First Name" info={mockData.first_name}></InfoLabel>
      <InfoLabel label="First Name" info={mockData.last_name}></InfoLabel>
      <InfoLabel label="Nationality" info={mockData.nationality}></InfoLabel>
      <InfoLabel
        label="Date of Birth"
        info={mockData.date_of_birth}
      ></InfoLabel>
      <div className="col-span-2">
        <InfoLabel label="University" info={mockData.university}></InfoLabel>
      </div>
      <InfoLabel label="Degree" info={mockData.degree}></InfoLabel>
      <InfoLabel label="Semester" info={mockData.semester}></InfoLabel>
      <InfoLabel label="First Name" info={mockData.first_name}></InfoLabel>
      <InfoLabel label="First Name" info={mockData.last_name}></InfoLabel>
      <InfoLabel label="Nationality" info={mockData.nationality}></InfoLabel>
      <InfoLabel
        label="Date of Birth"
        info={mockData.date_of_birth}
      ></InfoLabel>
      <div className="col-span-2">
        <InfoLabel label="University" info={mockData.university}></InfoLabel>
      </div>
      <InfoLabel label="Degree" info={mockData.degree}></InfoLabel>
      <InfoLabel label="Test" info={mockData.semester}></InfoLabel>
      <div className="col-span-2">
        <InfoLabel
          label="Why do you want to join TUM.ai"
          info={longText}
        ></InfoLabel>
      </div>
      <InfoLabel label="Degree" info={mockData.degree}></InfoLabel>
      <InfoLabel label="Semester" info={mockData.semester}></InfoLabel>
    </div>
  );
}
