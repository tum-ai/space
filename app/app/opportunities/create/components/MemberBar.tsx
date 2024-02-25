import { ButtonIcon } from "@components/IconButton";
import Tag from "@components/Tag";
import { Card } from "@components/ui/card";
import { TrashIcon } from "@radix-ui/react-icons";
import Image from "next/image";

interface DisplayMember {
  photoUrl?: string;
  name: string;
  tags?: {
    text: string;
    color: string;
  }[];
  onDelete?: () => void;
}

export function MemberBar(props: DisplayMember) {
  return (
    <Card className="flex items-center justify-between px-4 py-3 shadow">
      <div className="flex items-center gap-6">
        {props.photoUrl && (
          <Image
            src={props.photoUrl}
            alt={`Image of ${props.name}`}
            width={40}
            height={40}
            className="rounded-md"
          />
        )}
        <div className="flex items-center gap-2 truncate">
          <h2 className="text-md">{props.name}</h2>
          {props.tags?.map((tag) => {
              return <Tag key={tag.text} text={tag.text} color={tag.color} />;
            })}
        </div>
      </div>
      {props.onDelete && (
        <ButtonIcon
          icon={<TrashIcon width={24} height={24} />}
          onClick={props.onDelete}
          className="text-gray-300"
        ></ButtonIcon>
      )}
    </Card>
  );
}

export function AddMemberBar(props: { text: string; onClick?: () => void }) {
  return (
    <Card
      onClick={props.onClick}
      className="flex cursor-pointer items-center justify-center border-dashed px-4 py-3 text-gray-300"
    >
      {props.text}
    </Card>
  );
}
