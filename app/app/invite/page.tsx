"use client";
import Page from "@/components/Page";
import ProtectedItem from "@/components/ProtectedItem";
import Textarea from "@/components/Textarea";
import { useStores } from "@/providers/StoreProvider";
import { observer } from "mobx-react";

const Invite = observer(() => {
  const { inviteModel } = useStores();
  const text = inviteModel.text;
  function handleChange(e) {
    inviteModel.text = e.target.value;
  }
  return (
    <ProtectedItem roles={["invite_members"]}>
      <Page>
        <div className="text-6xl font-thin">Invite Members</div>
        <br />
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await inviteModel.invite();
          }}
          className="flex w-full flex-col items-start space-y-8 lg:w-1/2"
        >
          <Textarea
            label="New members"
            placeholder="email,first_name,last_name,department_handle,department_position"
            type="text"
            id="description"
            name="description"
            value={text}
            onChange={handleChange}
            required={true}
          />
          <button
            type="submit"
            className="w-1/2 rounded-lg bg-gray-200 p-4 px-8 py-1 text-black"
          >
            <div>invite</div>
          </button>
        </form>
      </Page>
    </ProtectedItem>
  );
});

export default Invite;
