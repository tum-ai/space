
'use client'
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'
import { useAuth } from "../../providers/AuthContextProvider";
import Banner from "../../components/Banner";
import Page from '../../components/Page';


// ========================================
// SIGN UP FORM
// - Form for user to fill in their profile information
// - send information to backend endpoint ./localhost:8000/profile/{user_id}
// - can be accessed via localhost:8000/signup-form
// ========================================

// TODO: 
// - input validation (e.g. email, phone, birthday, etc.) when required
// - additional feedback (e.g.) highlighting missing fields
// - add better description for each field

function SignUpForm() {
    // authentication information used for updating the user profile in the database
    const {user} = useAuth();
    const router = useRouter();
    const [error, setError] = useState(false);
    const [userID, setUserID] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    // form data, as required by backend endpoint
    const [formData, setFormData] = useState({
        email: user.email,
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
        job_history: [
            {
                employer: "",
                position: "",
                date_from: "",
                date_to: ""
            }
        ],
        time_joined: "",
        social_networks: [
            {
                type: "",
                handle: "",
                link: ""
            }
        ]
    });
    
    // handle change of form data, update state and corresponding form data values
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleArrayFieldChange = (key, index, subKey) => (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
        ...prevState,
        [key]: prevState[key].map((item, i) => {
            if (i === index) {
                return {
                    ...item,
                    [subKey]: value
                };
            }
            return item;
        })
        }));
    };

    const addArrayField = (key) => () => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: [...prevState[key], {
            // if the key is job_history, add a new job history item, else add a new social network item
            ...(key === "job_history"
                ? {
                    employer: "",
                    position: "",
                    date_from: "",
                    date_to: ""
                  } : {
                    type: "",
                    handle: "",
                    link: ""
                  })                    
            }
          ]
        }));
    };

    const removeArrayField = (key) => () => {
      // remove last entry of the array located at formData[] if there is more than one left
      if (formData[key].length > 1) {
        setFormData((prevState) => ({
            ...prevState,
            [key]: prevState[key].slice(0, -1)
        }));
      }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check required fields
        const requiredFields = ["first_name", "last_name", "birthday"];
        const missingFields = requiredFields.filter((field) => {
            if (Array.isArray(formData[field])) {
                return formData[field].some((item) => Object.values(item).some((value) => !value));
            }
            return !formData[field];
        });

        if (missingFields.length > 0) {
            setError(true);
            setErrorMessage(`Please fill in all required fields: ${missingFields.join(", ")}`);
            return;
        }

         // Create the payload for the PATCH request
        const payload = {
            ...formData,
            job_history: formData.job_history.map((item) => ({ ...item })),
            social_networks: formData.social_networks.map((item) => ({ ...item }))
        };
        
        // Send the PATCH request to the backend
        axios.patch('/profile/' + user.uid, payload, {
          headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              }
          })
          .then((response) => {
              console.log("Profile updated successfully");
              // Redirect to main page
              router.push("/");
          })
          .catch((error) => {
              console.error("Error updating profile:", error);
              console.log(payload)
          });
           console.log("Submitted form data:", payload);
        };

    return (
    <div className="py-8 px-4">
        {error && (
            <Banner
                headline="Error"
                text={errorMessage}
            />
        )}
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-gray-850">Welcome to TUM.ai Space!</h1>
            <p className="text-gray-700 py-2">Please fill in the following information to complete your profile.</p>
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
                                                onChange={handleArrayFieldChange(key, index, subKey)}
                                                placeholder={subKey.charAt(0).toUpperCase() + subKey.slice(1)}
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
                                type={key === "birthday" ? "date" : key === "timeJoined" ? "datetime-local" : "text"}
                                name={key}
                                // if key is email, dont allow typing, use the email from the user object
                                value = {key === "email" ? user.email : value || ""}
                                onChange={handleChange}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                required={key === "id" || key === "firebaseUid" || key === "firstName" || key === "lastName"} 
                            />
                        )}
                    </div>
                ))}
                <button
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500"
                    type="submit"
                >
                    Submit Profile
                </button>
            </form>
        </div>
    </div>
);
}

export default SignUpForm;
