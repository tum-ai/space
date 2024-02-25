import { IconBaseProps } from "react-icons";
import * as Icons from "react-icons/fa";

interface Props extends IconBaseProps {
  name: keyof typeof Icons;
  className?: string;
}

/**
 * @deprecated any icon component
 */
function Icon({ name, className, ...props }: Props) {
  const IconComponent = Icons[name];

  return (
    <div className={className}>
      <IconComponent {...props} />
    </div>
  );
}

export default Icon;
