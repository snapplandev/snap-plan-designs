import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/**
 * Reusable button primitive with refined motion and accessible focus treatment.
 * Edge case: defaults to type="button" to avoid accidental form submission.
 */
export default function Button({
  type = "button",
  variant = "primary",
  className,
  ...props
}: Readonly<ButtonProps>) {
  const classes = ["button", `button--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return <button className={classes} type={type} {...props} />;
}
