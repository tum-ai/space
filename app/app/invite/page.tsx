"use client";
import { Button } from "@components/Button";
import ProtectedItem from "@components/ProtectedItem";
import Textarea from "@components/Textarea";
import { Section } from "@components/section";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";

const Invite = observer(() => {
  const { inviteModel } = useStores();
  const text = inviteModel.text;
  function handleChange(e) {
    inviteModel.text = e.target.value;
  }
  return (
    <ProtectedItem roles={["invite_members"]}>
    <Section>
      <div className="text-6xl font-thin">Invite Members</div>
    </Section>
      <Section>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await inviteModel.invite();
          }}
          className="grid grid-cols-1 items-end gap-4 lg:gap-8 rounded-lg p-8 bg-gray-200 dark:bg-gray-600"
          >
          <h2 className="text-2xl">Create Certificate</h2>
          <p>
            Use the following format to invite members:
            <br />
            <br />
            <code>email,first_name,last_name,department_handle,department_position</code>
            <br />
            <br />
            <code><b>department_handle:</b> DEV,MARKETING,INDUSTRY,MAKEATHON,COMMUNITY,PNS,LNF,VENTURE,EDUCATION,RND</code>
            <br />
            <code><b>department_position:</b> teamlead,president,member,alumni</code>
          </p>
          <Textarea
            label="New members"
            placeholder="email@example.com,John,Doe,DEV,teamlead"
            type="text"
            id="description"
            name="description"
            value={text}
            onChange={handleChange}
            required={true}
          />
          <Button
            type="submit"
          >
            invite
          </Button>
        </form>
      </Section>
    </ProtectedItem>
  );
});

export default Invite;
