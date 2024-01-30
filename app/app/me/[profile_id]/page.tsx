"use client";

import ProfileOverview from "../components/ProfileOverview";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { useEffect, useState } from "react";

const Me = async () => {
  // Add data retrieval
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  //TODO: Fetch data from backend, by accessing first user then profile?
  const [profileData, setProfile] = useState(null);
  const [error, setError] = useState(null);

  console.log("userId:", userId);

  useEffect(() => {
    // Fetch user data to get profileId
    fetch(`/api/user/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then(userData => {
        if (userData && userData.profileId) {
          // Step 2: Fetch Profile Data
          return fetch(`/api/me/${userData.profileId}`);
        } else {
          throw new Error('Profile ID not found');
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return response.json();
      })
      .then(profileData => {
        setProfile(profileData);
      })
      .catch(error => {
        setError(error.message);
      });
  }, [userId]);

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

  return <ProfileOverview profile={[data]} />;
};

export default Me;
