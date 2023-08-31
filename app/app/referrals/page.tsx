"use client";
import { Button } from "@components/Button";
import Dialog from "@components/Dialog";
import Input from "@components/Input";
import { Section } from "@components/Section";
import Textarea from "@components/Textarea";
import { useStores } from "@providers/StoreProvider";
import * as DialogRadix from "@radix-ui/react-dialog";
import { observer } from "mobx-react";

const Referrals = observer(() => {
  const { referralsModel } = useStores();
  const referrals = referralsModel.referrals;

  return (
    <>
      <Section className="flex items-center justify-between">
        <div className="text-6xl font-thin">Referrals</div>
        <SubmitReferral />
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
          <tbody>
            {referrals.map((referral) => (
              <tr>
                <td>{referral.email}</td>
                <td>{referral.first_name}</td>
                <td>{referral.last_name}</td>
                <td>{referral.comment}</td>
                <td className="p-4">
                  <Button
                    onClick={() => {
                      if (
                        confirm(
                          "Are you sure you want to delete this referral?",
                        )
                      ) {
                        referralsModel.deleteReferral(referral.email);
                      }
                    }}
                  >
                    delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </>
  );
});

const SubmitReferral = observer(() => {
  const { referralsModel } = useStores();
  const referral = referralsModel.referral;

  function handleChange(e) {
    referralsModel.setReferralAttribute(e.target.name, e.target.value);
  }

  return (
    <Dialog trigger={<Button>submit referral</Button>}>
      <form className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <DialogRadix.Title className="col-span-2 flex items-center justify-between">
          <h1 className="text-3xl">Submit Referral</h1>
          <div className="col-span-2 flex space-x-2">
            <DialogRadix.Close>
              {/* TODO: Handle form correctly */}
              <Button
                onClick={async (e) => {
                  await referralsModel.submitRefrral();
                }}
              >
                refer
              </Button>
            </DialogRadix.Close>

            <DialogRadix.Close>
              <Button variant="secondary">cancel</Button>
            </DialogRadix.Close>
          </div>
        </DialogRadix.Title>
        <Input
          label="Email (must match application email)"
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
      </form>
    </Dialog>
  );
});

export default Referrals;
