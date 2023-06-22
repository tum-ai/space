"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth, getUserAuthToken } from "../../providers/AuthContextProvider";
import Banner from "../../components/Banner";
import Page from "../../components/Page";
import ProfileEditor from "../me/components/ProfileEditor";

// ========================================
// SIGN UP FORM
// - Form for user to fill in their profile information
// - send information to backend endpoint ./localhost:8000/profile/{user_id}
// - can be accessed via localhost:8000/signup-form
// ========================================

function SignUpForm() {
  // authentication information used for updating the user profile in the database
  // const { user } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [userID, setUserID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // form data, as required by backend endpoint
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    birthday: "",
    nationality: "",
    description: "",
    activity_status: "",
    degree_level: "",
    degree_name: "",
    degree_semester: "",
    university: "",
    job_history: [],
    social_networks: [],
  });

  // handle change of form data, update state and corresponding form data values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle change of array fields, update state and corresponding form data values
  const handleArrayFieldChange = (key, index, subKey) => (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [key]: prevState[key].map((item, i) => {
        if (i === index) {
          return {
            ...item,
            [subKey]: value,
          };
        }
        return item;
      }),
    }));
  };

  // add a new array field to form data (either job history or social network)
  const addArrayField = (key) => () => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: [
        ...prevState[key],
        {
          // if the key is job_history, add a new job history item, else add a new social network item
          ...(key === "job_history"
            ? {
                employer: "",
                position: "",
                date_from: "",
                date_to: "",
              }
            : {
                type: "",
                handle: "",
                link: "",
              }),
        },
      ],
    }));
  };

  const removeArrayField = (key) => () => {
    // remove last entry of the array located at formData[] if there is more than one left
    setFormData((prevState) => ({
      ...prevState,
      [key]: prevState[key].slice(0, -1),
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // Check required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "birthday",
      "degree_name",
      "degree_semester",
    ];
    const missingFields = requiredFields.filter((field) => {
      if (Array.isArray(formData[field])) {
        return formData[field].some((item) =>
          Object.values(item).some((value) => !value)
        );
      }
      return !formData[field];
    });

    if (missingFields.length > 0) {
      setError(true);
      setErrorMessage(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Create the payload for the PATCH request
    const payload = {
      ...formData,
      job_history: formData.job_history
        .map((item) => ({ ...item }))
        .filter((item) => Object.values(item).some((value) => !!value)),
      social_networks: formData.social_networks
        .map((item) => ({ ...item }))
        .filter((item) => Object.values(item).some((value) => !!value)),
      time_joined: new Date().toISOString(),
    };

    console.log(JSON.stringify(payload));

    const authToken = await getUserAuthToken();

    // Send the PATCH request to the backend
    await axios
      .patch("http://localhost:8000/me", payload, {
        headers: {
          Authorization: authToken,
        },
      })
      .then((response) => {
        console.log("Profile updated successfully");
        console.log(payload);
        // Redirect to main page after updating the profile
        router.push("/");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        console.log(payload);
        console.log(formData);
      });
    console.log("Submitted form data:", payload);
  }

  return (
    <Page>
      <div className="font-thin text-6xl">Welcome to TUM.ai Space!</div>
      <div className="font-light text-gray-500 py-8 px-4 text-xl">
        Please complete your profile to get started. You can always edit your
        profile later.
      </div>
      <ProfileEditor />
      <div className="py-8 px-4">
        {error && <Banner headline="Error" text={errorMessage} />}
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold text-gray-850">
            Welcome to TUM.ai Space!
          </h1>
          <form onSubmit={handleSubmit}>
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </label>
                {key === "job_history" || key === "social_networks" ? (
                  <>
                    {value.map((item, index) => (
                      <div key={index}>
                        {Object.entries(item).map(([subKey, subValue]) => (
                          <input
                            key={subKey}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            type="text"
                            name={`${key}[${index}].${subKey}`}
                            value={subValue || ""}
                            onChange={handleArrayFieldChange(
                              key,
                              index,
                              subKey
                            )}
                            placeholder={
                              subKey.charAt(0).toUpperCase() + subKey.slice(1)
                            }
                            required={subKey === "type"}
                          />
                        ))}
                      </div>
                    ))}
                    <button
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                      type="button"
                      onClick={addArrayField(key)}
                    >
                      Add {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                    <button
                      className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                      type="button"
                      onClick={removeArrayField(key)}
                    >
                      Remove {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  </>
                ) : (
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    type={
                      key === "birthday"
                        ? "date"
                        : key === "timeJoined"
                        ? "datetime-local"
                        : "text"
                    }
                    name={key}
                    // if key is email, dont allow typing, use the email from the iuser object
                    value={key === "email" ? "usermailtodo" : value || ""}
                    onChange={handleChange}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    required={
                      key === "id" ||
                      key === "firebaseUid" ||
                      key === "firstName" ||
                      key === "lastName"
                    }
                  />
                )}{" "}
              </div>
            ))}{" "}
            <button
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500"
              type="submit"
            >
              Submit Profile
            </button>{" "}
          </form>
        </div>
      </div>
    </Page>
  );
}

export default SignUpForm;
