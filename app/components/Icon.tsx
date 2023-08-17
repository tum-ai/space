import * as Icons from "react-icons/fa";

function Icon({ name, className, ...props }) {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.FaBeer {...props} />;
  }

  return (
    <div className={className}>
      <IconComponent {...props} />
    </div>
  );
}

export default Icon;
