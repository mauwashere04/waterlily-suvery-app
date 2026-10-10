import type { SurveyQuestion } from "@/types/survey";
import { Input } from "@/components/ui/Input";
import { RadioOptionGroup } from "@/components/ui/RadioOptionGroup";
import { FieldError } from "@/components/ui/FieldError";

export function QuestionField({
  question,
  value,
  onChange,
  error,
}: {
  question: SurveyQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {question.title}
      </h2>
      <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        {question.description}
      </p>

      <div className="mt-6">
        {question.type === "number" && (
          <Input
            type="number"
            inputMode="numeric"
            hasError={Boolean(error)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {question.type === "text" && question.key === "state" && (
          <Input
            type="text"
            hasError={Boolean(error)}
            value={value}
            placeholder="CA"
            maxLength={2}
            autoCapitalize="characters"
            onChange={(e) =>
              onChange(e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase())
            }
          />
        )}

        {question.type === "text" && question.key !== "state" && (
          <Input
            type="text"
            hasError={Boolean(error)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}

        {question.type === "single" && (
          <RadioOptionGroup
            name={question.id}
            options={question.options}
            value={value}
            onChange={onChange}
            hasError={Boolean(error)}
          />
        )}
      </div>

      <FieldError message={error} />
    </div>
  );
}
