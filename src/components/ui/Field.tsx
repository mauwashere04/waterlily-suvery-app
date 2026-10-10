import { ReactNode } from "react";
import { FieldError } from "./FieldError";

export function Field({
  label,
  description,
  error,
  htmlFor,
  children,
}: {
  label: string;
  description?: string;
  error?: string | null;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
      >
        {label}
      </label>
      {description && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      )}
      <div className="mt-3">{children}</div>
      <FieldError message={error} />
    </div>
  );
}
