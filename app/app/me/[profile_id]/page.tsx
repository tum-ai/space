"use client";

import ProfileOverview from "../components/ProfileOverview";
import { Profile } from "../../../models/profile";

const Me = () => {
  /*
  const { meModel } = useStores();
  const profileQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => axios("/me"),
  });

  // Set editorProfile as soon as data is available
  if (profileQuery.data?.data?.data) {
    meModel.editorProfile = { ...profileQuery.data.data.data };
  }

  if (profileQuery.isLoading) {
    return <h1>Loading profile</h1>;
  }
  if (!profileQuery.data?.data?.data) {
    return <h1>Profile not found.</h1>;
  }
  */

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
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
  };

  const { id, email, image, activity_status, current_department, current_department_position, 
    first_name, last_name, nationality, birthday, university, degree_level, 
    degree_name, degree_semester, description } = data;

  const restructured = {
    general: {
      id,
      email,
      image,
      activity_status,
      current_department,
      current_department_position,
    },
    grid: {
      personal: {
        first_name,
        last_name,
        nationality,
        birthday: new Date(birthday),
      },
      academia: {
        university,
        degree_level,
        degree_name,
        degree_semester,
      },
      description,
    },
  };

  return <ProfileOverview profile={restructured} />;
};

export default Me;
