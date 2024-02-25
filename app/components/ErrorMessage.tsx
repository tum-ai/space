import { ErrorMessage as FormikErrorMessage } from "formik";
interface Props {
  name: string;
}

/**
 * @deprecated use react-hook-form
 */
const ErrorMessage = ({ name }: Props) => {
  return (
    <FormikErrorMessage
      component="p"
      className="mt-2 font-bold text-red-500"
      name={name}
    />
  );
};

export default ErrorMessage;
