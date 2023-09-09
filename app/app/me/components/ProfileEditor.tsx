"use client";
import { Button } from "@components/Button";
import Dialog from "@components/Dialog";
import Input from "@components/Input";
import Select from "@components/Select";
import Textarea from "@components/Textarea";
import { useStores } from "@providers/StoreProvider";
import * as DialogRadix from "@radix-ui/react-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

const newJobExperience = {
  employer: "",
  position: "",
  date_from: "",
  date_to: "",
};

const socialNetworksTypes = [
  // 'Slack', 'LinkedIn', 'GitHub', 'Phone', 'Instagram', 'Telegram', 'Discord', 'Other'
  { key: "Slack", value: "Slack" },
  { key: "LinkedIn", value: "LinkedIn" },
  { key: "GitHub", value: "GitHub" },
  { key: "Phone", value: "Phone" },
  { key: "Instagram", value: "Instagram" },
  { key: "Telegram", value: "Telegram" },
  { key: "Discord", value: "Discord" },
  { key: "Other", value: "Other" },
];

function ProfileEditor({ trigger }) {
  const { meModel } = useStores();
  const editorProfile = meModel.editorProfile;

  function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async function handleChange(e) {
    // profile picture handling
    if (e.target.name === "profile_picture") {
      const file = e.target.files[0];
      const MB = 1048576;
      if (file.size > 0.2 * MB) {
        toast.error("File is too big! Max size is 200 KB.");
      } else {
        const base64 = await convertImageToBase64(file);
        meModel.updateEditorProfile({
          ["profile_picture"]: base64,
        });
      }
    } else {
      meModel.updateEditorProfile({
        [e.target.name]: e.target.value,
      });
    }
  }

  const queryClient = useQueryClient();

  return (
    <Dialog trigger={trigger || <Button>edit</Button>}>
      <div className="flex w-full flex-col space-y-6">
        <DialogRadix.Title className="flex items-center justify-between">
          <h1 className="text-3xl">Edit Profile</h1>
          <div className="col-span-2 flex space-x-2">
            <DialogRadix.Close>
              <Button
                onClick={async (e) => {
                  await meModel.editProfile();
                  queryClient.invalidateQueries({ queryKey: ["me"] });
                }}
              >
                save
              </Button>
            </DialogRadix.Close>
            <DialogRadix.Close>
              <Button variant="secondary">cancel</Button>
            </DialogRadix.Close>
          </div>
        </DialogRadix.Title>
        <form className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          <div className="col-span-2 flex items-center space-x-4">
            {editorProfile.profile_picture ? (
              <div className="flex flex-col items-center">
                <Image
                  className="h-28 w-28 rounded-full border object-cover drop-shadow-lg"
                  src={editorProfile.profile_picture}
                  width={100}
                  height={100}
                  alt=""
                />
                <button
                  onClick={() => {
                    meModel.updateEditorProfile({
                      ["profile_picture"]: null,
                    });
                  }}
                >
                  remove
                </button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  document.getElementById("profile_picture").click();
                }}
              >
                <Input
                  label="Upload picture"
                  type="file"
                  accept="image/*"
                  id="profile_picture"
                  name="profile_picture"
                  onChange={handleChange}
                />
              </Button>
            )}
          </div>
          <Input
            label="First name"
            type="text"
            id="first_name"
            name="first_name"
            value={editorProfile.first_name}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Last name"
            type="text"
            id="last_name"
            name="last_name"
            value={editorProfile.last_name}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Nationality"
            type="text"
            id="nationality"
            name="nationality"
            value={editorProfile.nationality}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="University"
            type="text"
            id="university"
            name="university"
            value={editorProfile.university}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Degree level"
            type="text"
            id="degree_level"
            name="degree_level"
            value={editorProfile.degree_level}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Degree name"
            type="text"
            id="degree_name"
            name="degree_name"
            value={editorProfile.degree_name}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Semester"
            type="number"
            id="degree_semester"
            name="degree_semester"
            value={editorProfile.degree_semester}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Current job"
            type="text"
            id="currentJob"
            name="currentJob"
            value={editorProfile.currentJob}
            onChange={handleChange}
          />
          <div className="col-span-2">
            <Textarea
              label="Description"
              type="text"
              id="description"
              name="description"
              value={editorProfile.description}
              onChange={handleChange}
              required={false}
            />
          </div>
          <hr className="col-span-2" />
          {/* Job Experience Editor */}
          <JobExperience />
          <hr className="col-span-2" />
          {/* Social Networks Editor */}
          <SocialNetworks />
        </form>
      </div>
    </Dialog>
  );
}

function SocialNetworks() {
  const { meModel } = useStores();
  const editorProfile = meModel.editorProfile;
  const [selectedOptions, setSelectedOptions] = useState(
    editorProfile.social_networks &&
      editorProfile.social_networks.map((network) => network.type),
  );

  const newSocialNetwork = {
    type: "",
    link: "",
    profile_id: editorProfile.id,
  };

  function handleAddExperience(type, newExperience) {
    if (!editorProfile[type]) {
      meModel.updateEditorProfile({
        [type]: [newExperience],
      });
      return;
    }

    meModel.updateEditorProfile({
      [type]: [...editorProfile[type], newExperience],
    });
  }

  function handleRemoveExperience(index, type) {
    const updatedExperience = [...editorProfile[type]];
    updatedExperience.splice(index, 1);
    meModel.updateEditorProfile({
      [type]: updatedExperience,
    });
  }

  function handleListItemChange(event, index, type) {
    const { name, value } = event.target;
    const updatedProfile = editorProfile[type].map((item, i) => {
      return i === index ? { ...item, [name]: value } : item;
    });
    meModel.updateEditorProfile({ [type]: updatedProfile });
  }

  const handleSelect = (item, index) => {
    const updatedSelectedOptions = [...selectedOptions];
    updatedSelectedOptions[index] = item.value;
    setSelectedOptions(updatedSelectedOptions);
    meModel.updateEditorProfile({
      social_networks: editorProfile.social_networks.map((network, i) => {
        if (i === index) {
          return {
            ...network,
            type: item.value,
          };
        }
        return network;
      }),
    });
  };

  return (
    <div className="col-span-2 w-full space-y-4">
      <div className="col-span-2 text-xl font-light">Social Networks</div>
      <div className="col-span-2 font-light text-black">
        Feel free to add any relevant social media networks (e.g. LinkedIn,
        GitHub, etc.) here.
      </div>
      {editorProfile.social_networks &&
        editorProfile.social_networks.map((experience, index) => (
          <div key={index} className="rounded-2xl border-2 border-gray-100 p-4">
            <Select
              setSelectedItem={(item) => handleSelect(item, index)}
              selectedItem={{
                key: experience.type,
                value: experience.type,
              }}
              placeholder="Select a type"
              options={socialNetworksTypes}
              disabled={false}
            />
            <Input
              label="Link"
              type="text"
              name="link"
              required={true}
              value={experience.link}
              onChange={(e) =>
                handleListItemChange(e, index, "social_networks")
              }
            />
            <button
              onClick={() => handleRemoveExperience(index, "social_networks")}
            >
              Remove
            </button>
          </div>
        ))}
      <button
        className="mt-4 rounded-lg bg-gray-200 p-2 hover:text-black hover:underline dark:bg-gray-700 dark:hover:text-white"
        onClick={() => handleAddExperience("social_networks", newSocialNetwork)}
      >
        Add Social Network
      </button>
    </div>
  );
}

function JobExperience() {
  const { meModel } = useStores();
  const editorProfile = meModel.editorProfile;

  function handleAddExperience(type, newExperience) {
    if (!editorProfile[type]) {
      meModel.updateEditorProfile({
        [type]: [newExperience],
      });
      return;
    }

    meModel.updateEditorProfile({
      [type]: [...editorProfile[type], newExperience],
    });
  }

  function handleRemoveExperience(index, type) {
    const updatedExperience = [...editorProfile[type]];
    updatedExperience.splice(index, 1);
    meModel.updateEditorProfile({
      [type]: updatedExperience,
    });
  }

  function handleListItemChange(event, index, type) {
    const { name, value } = event.target;
    const updatedProfile = editorProfile[type].map((item, i) => {
      return i === index ? { ...item, [name]: value } : item;
    });
    meModel.updateEditorProfile({ [type]: updatedProfile });
  }

  return (
    <div className="col-span-2 w-full space-y-4">
      <div className="col-span-2 text-xl font-light">Job history</div>
      <div className="col-span-2 font-light text-black">
        You can update your job history and add your previous work experience
        here.
      </div>
      {editorProfile.job_history &&
        editorProfile.job_history.map((experience, index) => (
          <div key={index} className="rounded-2xl border-2 border-gray-100 p-4">
            <Input
              label="Employer"
              type="text"
              name="employer"
              value={experience.employer}
              required={true}
              onChange={(e) => handleListItemChange(e, index, "job_history")}
            />
            <Input
              label="Position"
              type="text"
              name="position"
              required={true}
              value={experience.position}
              onChange={(e) => handleListItemChange(e, index, "job_history")}
            />
            <Input
              label="Start date"
              type="date"
              name="date_from"
              required={true}
              value={experience.date_from}
              onChange={(e) => handleListItemChange(e, index, "job_history")}
            />
            <Input
              label="End date"
              type="date"
              name="date_to"
              required={true}
              value={experience.date_to}
              onChange={(e) => handleListItemChange(e, index, "job_history")}
            />
            <button
              onClick={() => handleRemoveExperience(index, "job_history")}
            >
              Remove
            </button>
          </div>
        ))}
      <button
        className="mt-4 rounded-lg bg-gray-200 p-2 hover:text-black hover:underline dark:bg-gray-700 dark:hover:text-white"
        onClick={() => handleAddExperience("job_history", newJobExperience)}
      >
        Add Work Experience
      </button>
    </div>
  );
}

export default observer(ProfileEditor);
