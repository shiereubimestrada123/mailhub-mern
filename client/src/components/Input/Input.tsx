import { ErrorMsg } from '@components';
import { UseFormRegisterReturn } from 'react-hook-form';

type InputProps = {
  htmlFor?: string;
  labelText?: string;
  id?: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  errorRequired?: string | boolean | undefined;
  errorPattern?: string | boolean | undefined;
  errorMinLength?: string | number | boolean | undefined;
  errorValidate?: string | boolean | undefined;
};

export function Input({
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
}: InputProps) {
  return (
    <label htmlFor={htmlFor} className='w-full max-w-xs form-control'>
      <div className='label'>
        <span className='label-text'>{labelText}</span>
      </div>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className='w-full max-w-xs input input-bordered'
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
