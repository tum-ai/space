import ProfilesList from "./components/ProfilesList";
import Page from "@components/Page";

function Profiles() {
  return (
    <Page>
      <div className="text-6xl font-thin">Members</div>
      <ProfilesList />
    </Page>
  );
}

export default Profiles;
