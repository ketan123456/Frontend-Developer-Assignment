import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const InputField = ({ label, error, hint, id, ...props }: InputFieldProps) => (
  <label className="field" htmlFor={id}>
    <span className="field-label">{label}</span>
    <input className="input-shell" id={id} {...props} />
    {error ? <span className="field-error">{error}</span> : hint ? <span className="field-hint">{hint}</span> : null}
  </label>
);
