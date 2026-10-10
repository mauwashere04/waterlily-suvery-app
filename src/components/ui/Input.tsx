import { forwardRef, InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
>(function Input({ hasError, className = "", ...props }, ref) {
  const base =
    "w-full rounded-lg border bg-white px-3 py-2.5 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:bg-zinc-950 dark:text-zinc-50";
  const border = hasError
    ? "border-red-400 focus:ring-red-400"
    : "border-zinc-300 focus:ring-indigo-500 dark:border-zinc-700";

  return <input ref={ref} className={`${base} ${border} ${className}`} {...props} />;
});
