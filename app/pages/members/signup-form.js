import ProfileEditor from "../me/components/ProfileEditor";
import Page from "../../components/Page";
import { observer } from "mobx-react";
import { useStores } from "/providers/StoreProvider";

function SignUpForm() {
  const { meModel } = useStores();
  const user = meModel.user;
  const profile = user?.profile;

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  meModel.editorProfile = { ...profile };
  return (
    <Page>
      <div className="font-thin text-6xl">Welcome to TUM.ai Space!</div>
      <div className="font-light text-gray-500 py-8 px-4 text-xl">
        Please complete your profile to get started. You can always edit your
        profile later.
      </div>
      <ProfileEditor isSignUpForm={true} />
    </Page>
  );
}

export default observer(SignUpForm);
