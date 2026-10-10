export function FieldError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-sm text-red-700 dark:text-red-400">
      <span aria-hidden className="mt-0.5 font-bold">
        !
      </span>
      <span>{message}</span>
    </p>
  );
}
