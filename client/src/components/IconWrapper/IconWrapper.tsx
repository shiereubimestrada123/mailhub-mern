import { ReactNode, CSSProperties } from 'react';
import { IconContext } from 'react-icons';

type IconProps = {
  children: ReactNode;
  color?: string;
  size?: string;
  className?: string;
  style?: CSSProperties;
  attr?: React.SVGAttributes<SVGElement>;
};

export function IconWrapper({
  children,
  color,
  size,
  className,
  style,
  attr,
}: IconProps) {
  return (
    <IconContext.Provider value={{ color, size, className, style, attr }}>
      {children}
    </IconContext.Provider>
  );
}
