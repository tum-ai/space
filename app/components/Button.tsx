import { Button as ShadCNButton, ButtonProps } from "./ui/button";


/**
 *  @deprecated. use components/ui/button
 */
const Button = (props: ButtonProps) => (
  <ShadCNButton {...props} />
)

export { Button };
