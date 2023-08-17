import ProfileEditor from "../me/components/ProfileEditor";
import { observer } from "mobx-react";
import Page from "@components/Page";
import { useStores } from "@providers/StoreProvider";

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
      <div className="text-6xl font-thin">Welcome to TUM.ai Space!</div>
      <div className="px-4 py-8 text-xl font-light text-gray-500">
        Please complete your profile to get started. You can always edit your
        profile later.
      </div>
      <ProfileEditor isSignUpForm={true} />
    </Page>
  );
}

export default observer(SignUpForm);
