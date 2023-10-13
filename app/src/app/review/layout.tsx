import { Button } from "@components/ui/button";
import ProtectedItem from "@components/ProtectedItem";
import { Section } from "@components/Section";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}
const ReviewLayout = ({ children }: Props) => (
  <ProtectedItem showNotFound roles={["submit_reviews"]}>
    <Section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <h1 className="text-6xl font-thin">Review Tool</h1>

      <div className="flex gap-2">
        <Button asChild className="flex w-max items-center gap-2">
          <Link href={"/review/myreviews"}>
            <MagnifyingGlassIcon /> My Reviews
          </Link>
        </Button>
      </div>
    </Section>

    {children}
  </ProtectedItem>
)

export default ReviewLayout;
