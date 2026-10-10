import type { Question, QuestionOption } from "@prisma/client";
import { ANSWER_RULES } from "@/lib/answerRules";

export type QuestionWithOptions = Question & { options: QuestionOption[] };

/**
 * Validates one raw answer against its question's rules. Returns an error
 * message to show the user, or null if the answer is valid. This runs
 * server-side as the real boundary check; the client-side copy is only for
 * instant feedback and must never be trusted on its own.
 */
export function validateAnswer(
  question: QuestionWithOptions,
  rawValue: string | undefined
): string | null {
  const value = (rawValue ?? "").trim();

  if (!value) {
    return "This question is required.";
  }

  const customRule = ANSWER_RULES[question.key];
  if (customRule) {
    const error = customRule(value);
    if (error) return error;
  }

  if (question.type === "single") {
    const validLabels = question.options.map((option) => option.label);
    if (!validLabels.includes(value)) {
      return "Choose one of the listed options.";
    }
  }

  return null;
}

/** Normalizes a validated answer before it's stored (e.g. "ca" -> "CA"). */
export function normalizeAnswerValue(
  question: QuestionWithOptions,
  rawValue: string
): string {
  const value = rawValue.trim();
  if (question.key === "state") {
    return value.toUpperCase();
  }
  return value;
}
