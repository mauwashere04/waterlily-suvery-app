export function RadioOptionGroup({
  name,
  options,
  value,
  onChange,
  hasError,
}: {
  name: string;
  options: { id: string; label: string }[];
  value: string | undefined;
  onChange: (label: string) => void;
  hasError?: boolean;
}) {
  return (
    <div role="radiogroup" className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const selected = value === option.label;
        return (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors ${
              selected
                ? "border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-950/40"
                : hasError
                  ? "border-red-300 dark:border-red-800"
                  : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.label}
              checked={selected}
              onChange={() => onChange(option.label)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                selected
                  ? "border-indigo-600 bg-indigo-600"
                  : "border-zinc-400 dark:border-zinc-600"
              }`}
            >
              {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="text-zinc-900 dark:text-zinc-100">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
}
