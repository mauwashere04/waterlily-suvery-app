export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300"
    >
      <span aria-hidden className="mt-0.5 font-bold">
        !
      </span>
      <span>
        <strong className="font-semibold">Error: </strong>
        {message}
      </span>
    </div>
  );
}
