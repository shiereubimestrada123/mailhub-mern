import { UseFormRegisterReturn } from "react-hook-form";
import { ErrorMsg } from "@components";

type InputProps = {
  htmlFor?: string;
  labelText?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  register?: UseFormRegisterReturn;
  errorRequired?: string | boolean | undefined;
  errorPattern?: string | boolean | undefined;
  errorMinLength?: string | number | boolean | undefined;
  errorValidate?: string | boolean | undefined;
  classInput?: string;
};

export function FormInput({
  htmlFor,
  labelText,
  id,
  type,
  placeholder,
  register,
  errorRequired,
  errorPattern,
  errorMinLength,
  errorValidate,
  classInput,
}: InputProps) {
  return (
    <label htmlFor={htmlFor} className="w-full max-w-xs form-control">
      <div className="label">
        <span className="label-text">{labelText}</span>
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={classInput}
        {...register}
      />
      <ErrorMsg
        id={id}
        message={
          errorRequired || errorPattern || errorMinLength || errorValidate
        }
      />
    </label>
  );
}
