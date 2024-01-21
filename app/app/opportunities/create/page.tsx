"use client";

import Input from "@components/Input";
import { Button } from "@components/ui/button";
import { Cross1Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import Select from "@components/Select";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MemberBar, AddMemberBar } from "./components/MemberBar";
import Dialog from "@components/Dialog";
import { useState } from "react";
import ErrorMessage from "@components/ErrorMessage";
import Textarea from "@components/Textarea";
import Tooltip from "@components/Tooltip";
import { DatePicker } from "@components/DatePicker";
import GeneralInformation from "./components/GeneralInformation";

const mockAdmins = [
  {
    id: 1,
    photoUrl: "https://placekitten.com/200/200",
    name: "Simon Huang",
    tags: [
      { text: "Owner", color: "yellow" },
      { text: "Development", color: "blue" },
    ],
  },
  {
    id: 2,
    photoUrl: "https://placekitten.com/201/201",
    name: "Max von Storch",
    tags: [{ text: "RnD", color: "green" }],
  },
];

const mockScreeners = [
  {
    id: 3,
    photoUrl: "https://placekitten.com/202/202",
    name: "Emma Johnson",
    tags: [{ text: "Legal and finance", color: "orange" }],
  },
  {
    id: 4,
    photoUrl: "https://placekitten.com/204/204",
    name: "Oliver Davis",
    tags: [{ text: "Community", color: "red" }],
  },
  {
    id: 5,
    photoUrl: "https://placekitten.com/206/206",
    name: "Sophia Rodriguez",
    tags: [{ text: "Development", color: "purple" }],
  },
];

const mockMembers = [
  {
    key: "Simon Huang",
    value: "1",
  },
  {
    key: "Tim Baum",
    value: "2",
  },
];

export default function CreateOpportunity() {
  return (
    <GeneralInformation
      members={mockMembers}
      screeners={mockScreeners}
      admins={mockAdmins}
    />
  );
}
