"use client";
import React from "react";
import { Application } from "@prisma/client";

interface ApplicationFormProps {
  application: Application;
}

const ApplicationForm = ({ application }: ApplicationFormProps) => {
  const content = application.content;

  // Function to check if a string is a URL
  const isURL = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(content).map(([key, value], index) => (
        <div key={index} className="border-b-2 border-gray-200 py-2">
          <strong>{key}:</strong>
          {Array.isArray(value) ? (
            <ul>
              {value.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {isURL(item) ? (
                    <a
                      href={item}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      Link
                    </a>
                  ) : (
                    item
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>
              {isURL(value) ? (
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  Link
                </a>
              ) : (
                value
              )}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationForm;
