import ProfileOverview from "../components/ProfileOverview";

const Me = ({ params }: { params: { profile_id: string } }) => {
  return <ProfileOverview profile_id={params.profile_id} />;
};

export default Me;
