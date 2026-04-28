import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}: PropsWithChildren<ButtonProps>) => (
  <button className={`button button--${variant} ${className}`.trim()} {...props}>
    {children}
  </button>
);
