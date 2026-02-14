type FieldProps = Readonly<{
  label: string;
  htmlFor: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}>;

/**
 * Unified field wrapper with light-touch guidance and validation surface.
 * Edge case: helper and error text can be omitted without collapsing spacing abruptly.
 */
export default function Field({
  label,
  htmlFor,
  helperText,
  error,
  required = false,
  children,
}: FieldProps) {
  return (
    <div className="intake-field">
      <label className="intake-field__label" htmlFor={htmlFor}>
        {label}
        {required ? <span className="intake-field__required"> *</span> : null}
      </label>
      {helperText ? <p className="intake-field__helper">{helperText}</p> : null}
      <div className="intake-field__control">{children}</div>
      {error ? (
        <p aria-live="polite" className="intake-field__error" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}
