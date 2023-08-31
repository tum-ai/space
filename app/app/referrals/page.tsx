"use client";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { Section } from "@components/Section";
import Textarea from "@components/Textarea";
import { useStores } from "@providers/StoreProvider";
import { observer } from "mobx-react";

const Referrals = observer(() => {
  const { referralsModel } = useStores();
  const referral = referralsModel.referral;
  const referrals = referralsModel.referrals;

  function handleChange(e) {
    referralsModel.setReferralAttribute(e.target.name, e.target.value);
  }

  return (
    <>
      <Section className="flex items-center justify-between">
        <div className="text-6xl font-thin">Referrals</div>
      </Section>
      <Section>
        <form
          className="top-28 z-0 grid h-fit grid-cols-1 items-end gap-4 rounded-lg bg-gray-200 p-8 dark:bg-gray-600 md:sticky lg:grid-cols-2 lg:gap-8"
          onSubmit={async (e) => {
            e.preventDefault();
            await referralsModel.submitRefrral();
          }}
        >
          <h2 className="text-2xl lg:col-span-2">Submit Referral</h2>
          <Input
            label="Email"
            type="email"
            id="email"
            name="email"
            value={referral.email}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="First Name"
            type="first_name"
            id="first_name"
            name="first_name"
            value={referral.first_name}
            onChange={handleChange}
            required={true}
          />
          <Input
            label="Last Name"
            type="last_name"
            id="last_name"
            name="last_name"
            value={referral.last_name}
            onChange={handleChange}
            required={true}
          />
          <div className="col-start-1">
            <Textarea
              label="Comment"
              placeholder="Why is this a good candidate?"
              type="text"
              id="comment"
              name="comment"
              value={referral.comment}
              onChange={handleChange}
              required={true}
            />
          </div>
          <Button className="col-start-1 md:col-span-2" type="submit">
            invite
          </Button>
        </form>
      </Section>
      <Section className="flex overflow-auto">
        <table className="mx-auto w-full min-w-[800px] table-auto text-center">
          <thead>
            <tr className="border-b border-b-gray-400 dark:border-b-white">
              <th className="p-4">Email</th>
              <th className="p-4">First Name</th>
              <th className="p-4">Last Name</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
        </table>
      </Section>
    </>
  );
});

export default Referrals;
