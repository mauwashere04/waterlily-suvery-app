import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500";

  const variants: Record<Variant, string> = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
    secondary:
      "border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800",
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
