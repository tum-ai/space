"use client";
import { Button } from "@components/Button";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import Textarea from "@components/Textarea";
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
          className="grid grid-cols-1 items-end gap-4 rounded-lg bg-gray-200 p-8 dark:bg-gray-600 lg:gap-8"
        >
          <h2 className="text-2xl">Create Invitations</h2>
          <p>
            Write each invite in one line like as below. After submitting the
            invitations, the invited emails will receive a welcome email and a
            link to reset their password. Use the following format to invite
            members:
            <br />
            <br />
            <p>
              email, first_name, last_name, department_handle,
              department_position
            </p>
            <br />
            <p>
              <b>department_handle:</b> DEV, MARKETING, INDUSTRY, MAKEATHON,
              COMMUNITY, PNS, LNF, VENTURE, EDUCATION, RND
            </p>
            <br />
            <p>
              <b>department_position:</b> teamlead,president,member,alumni
            </p>
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
          <Button type="submit">invite</Button>
        </form>
      </Section>
    </ProtectedItem>
  );
});

export default Invite;
