import { observer } from "mobx-react";
import Input from "/components/Input";
import Textarea from "/components/Textarea";
import { useStores } from "/providers/StoreProvider";
import { useRouter } from "next/router";

function ProfileEditor({ isSignUpForm = false }) {
  const { uiModel, meModel } = useStores();
  const editorProfile = meModel.editorProfile;
  const router = useRouter();

  function handleChange(e) {
    meModel.updateEditorProfile({
      [e.target.name]: e.target.value,
    });
  }

  function handleListItemChange(e, index, type) {
    const { name, value } = e.target;
    if (type === "job_history") {
      meModel.updateEditorProfile({
        job_history: editorProfile.job_history.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              [name]: value,
            };
          }
          return item;
        }),
      });
    } else if (type === "social_networks") {
      meModel.updateEditorProfile({
        social_networks: editorProfile.social_networks.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              [name]: value,
            };
          }
          return item;
        }),
      });
    }
  }

  function handleAddExperience() {
    const newExperience = {
      employer: "",
      position: "",
      date_from: "",
      date_to: "",
    };
    if (!editorProfile.job_history) {
      meModel.updateEditorProfile({
        job_history: [newExperience],
      });
      return;
    }
    // if job history exists, add new experience to the end of the array
    meModel.updateEditorProfile({
      job_history: [...editorProfile.job_history, newExperience],
    });
  }

  function handleRemoveExperience(index) {
    const updatedExperience = [...editorProfile.job_history];
    updatedExperience.splice(index, 1);
    meModel.updateEditorProfile({
      job_history: updatedExperience,
    });
  }

  return (
    <div className="flex flex-col space-y-6 rounded-lg p-6 bg-white dark:bg-gray-700 w-full">
      <div className="text-2xl font-light">Edit profile</div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await meModel.editProfile();
          meModel.getProfile();
          isSignUpForm ? router.push("/") : uiModel.toggleModal();
        }}
        className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-8"
      >
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
        <div className="col-span-2 text-xl font-light">Job history</div>
        <div className="col-span-2 text-black font-light">
          You can update your job history and add your previous work experience
          here.
        </div>
        {!editorProfile.job_history
          ? null
          : editorProfile.job_history.map((experience, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <Input
                  label="Employer"
                  type="text"
                  name="employer"
                  value={experience.Employer}
                  required={true}
                  onChange={(e) =>
                    handleListItemChange(e, index, "job_history")
                  }
                />
                <Input
                  label="Position"
                  type="text"
                  name="position"
                  required={true}
                  value={experience.Position}
                  onChange={(e) =>
                    handleListItemChange(e, index, "job_history")
                  }
                />
                <Input
                  label="Start date"
                  type="date"
                  name="date_from"
                  required={true}
                  value={experience.Startdate}
                  onChange={(e) =>
                    handleListItemChange(e, index, "job_history")
                  }
                />
                <Input
                  label="End date"
                  type="date"
                  name="date_to"
                  required={true}
                  value={experience.Enddate}
                  onChange={(e) =>
                    handleListItemChange(e, index, "job_history")
                  }
                />
                <button onClick={() => handleRemoveExperience(index)}>
                  Remove
                </button>
              </div>
            ))}
        <button onClick={handleAddExperience}>Add Work Experience</button>
        <div className="col-span-2 flex space-x-2">
          <button
            type="submit"
            className="p-4 px-8 py-1 rounded-lg w-1/2 bg-gray-200 text-black"
          >
            <div>save</div>
          </button>
          {isSignUpForm ? null : (
            <button
              onClick={() => {
                // if user currently signs up, redirect him to main page
                uiModel.toggleModal();
              }}
              className="p-4 px-8 py-1 rounded-lg w-1/2 border-2"
            >
              <div>cancel</div>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default observer(ProfileEditor);
