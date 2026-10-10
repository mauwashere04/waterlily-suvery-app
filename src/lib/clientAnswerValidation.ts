import type { SurveyQuestion } from "@/types/survey";
import { ANSWER_RULES } from "@/lib/answerRules";

/**
 * Client-side mirror of lib/validation.ts's validateAnswer, used only for
 * instant feedback while the user is filling out the wizard. The server
 * route re-runs the same ANSWER_RULES and is the real boundary check --
 * this copy exists purely so Next/Submit can show an error without a
 * round trip, never as the source of truth.
 */
export function validateAnswerClient(
  question: SurveyQuestion,
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
