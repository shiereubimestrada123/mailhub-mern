type InputProps = {
  labelText: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  value?: string;
  // type: string;
  // placeholder: string;
};

export function Input({ labelText, inputProps, value }: InputProps) {
  return (
    <label className='w-full max-w-xs form-control'>
      <div className='label'>
        <span className='label-text'>{labelText}</span>
      </div>
      <input
        {...inputProps}
        value={value}
        className='w-full max-w-xs input input-bordered'
      />
    </label>
  );
}
