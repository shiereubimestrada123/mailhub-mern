type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
};

export function Button({
  onClick,
  type = 'button',
  children,
  className,
}: ButtonProps) {
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
