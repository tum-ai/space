
'use client'
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import Banner from "../../components/Banner";
import Page from '../../components/Page';

function SignUpForm() {
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
      console.log(formData)
      console.log(formData[key].length)
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
        const requiredFields = ["email", "first_name", "last_name", "birthday", "job_history", "social_networks"];
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

        fetch('http://localhost:8000/profile/' + userID, {
          method: 'PATCH',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
         })
        .then((response) => {
            if (response.ok) {
                console.log("Profile updated successfully");
                // Redirect to main page
                router.push("/");
            } else {
                throw new Error("Failed to update profile");
            }
        })
        .catch((error) => {
            console.error("Error updating profile:", error);
        });
        
    };

    // TODO extract common component OR directly display necessary singup fields in the signup part
    
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
                                                required
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
                                value={value || ""}
                                onChange={handleChange}
                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                required={key === "id" || key === "firebaseUid" || key === "email" || key === "firstName" || key === "lastName" || key === "job_history" || key === "social_networks"}
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
