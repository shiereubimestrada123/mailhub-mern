type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
};

export function Button({
  onClick,
  type = 'button',
  children,
  className,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
