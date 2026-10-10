"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SurveyInfo, SurveyQuestion } from "@/types/survey";
import { QuestionField } from "./QuestionField";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { validateAnswerClient } from "@/lib/clientAnswerValidation";

export function SurveyWizard({
  survey,
  questions,
}: {
  survey: SurveyInfo;
  questions: SurveyQuestion[];
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const total = questions.length;
  const current = questions[index];
  const isLast = index === total - 1;
  const isFirst = index === 0;
  const progressPercent = Math.round(((index + 1) / total) * 100);

  function setAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }

  function validateCurrent(): boolean {
    const error = validateAnswerClient(current, answers[current.id]);
    if (error) {
      setErrors((prev) => ({ ...prev, [current.id]: error }));
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateCurrent()) return;
    setFormError(null);
    setIndex((i) => Math.min(i + 1, total - 1));
  }

  function goPrevious() {
    setFormError(null);
    setIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    if (!validateCurrent()) return;

    // Defensive full-survey pass in case an earlier answer is somehow still
    // invalid (e.g. user navigated back and cleared a field). Sequential
    // Next-gating should prevent this, but the UI must never trust itself
    // more than the data it's about to send.
    const allErrors: Record<string, string> = {};
    for (const q of questions) {
      const error = validateAnswerClient(q, answers[q.id]);
      if (error) allErrors[q.id] = error;
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstInvalidIndex = questions.findIndex((q) => allErrors[q.id]);
      setIndex(firstInvalidIndex);
      setFormError("Some answers need fixing before you can submit.");
      return;
    }

    setSubmitting(true);
    setFormError(null);

    const res = await fetch("/api/survey/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const serverErrors = (data.errors ?? {}) as Record<string, string>;
      const { form, ...fieldErrors } = serverErrors;

      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        const firstInvalidIndex = questions.findIndex((q) => fieldErrors[q.id]);
        if (firstInvalidIndex !== -1) setIndex(firstInvalidIndex);
      }
      setFormError(form ?? "Some answers need fixing before you can submit.");
      setSubmitting(false);
      return;
    }

    router.push("/review");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
        {survey.title}
      </h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{survey.description}</p>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <span>
            Question {index + 1} of {total}
          </span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-28 flex-none overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="w-10 flex-none text-right tabular-nums">{progressPercent}%</span>
          </div>
        </div>

        <FormError message={formError} />

        <QuestionField
          question={current}
          value={answers[current.id] ?? ""}
          onChange={(value) => setAnswer(current.id, value)}
          error={errors[current.id]}
        />

        <div className="mt-8 flex items-center justify-between">
          <Button type="button" variant="secondary" onClick={goPrevious} disabled={isFirst}>
            Previous
          </Button>

          {isLast ? (
            <Button type="button" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
