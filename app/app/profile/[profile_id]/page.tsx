"use client";

import ProfileOverview from "../components/ProfileOverview";

const Me = () => {
  // Add data retrieval

  const data = {
    id: "1",
    email: "max@mustermann.com",
    image: "https://placekitten.com/200/200",
    activity_status: "active",
    current_department: "DEV",
    current_department_position: "Team Lead",
    first_name: "Max",
    last_name: "Mustermann",
    nationality: "German",
    birthday: new Date("2023-12-18"),
    university: "TUM",
    degree_level: "Bachelor",
    degree_name: "Informatics",
    degree_semester: 100,
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
  };

  return <ProfileOverview profile={data} />;
};

export default Me;
