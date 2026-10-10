import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyWithQuestions, getSubmissionWithAnswers } from "@/lib/survey";
import { AppHeader } from "@/components/AppHeader";

export default async function ReviewPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const survey = await getSurveyWithQuestions();
  const submission = await getSubmissionWithAnswers(user.id, survey.id);

  if (!submission) {
    redirect("/survey");
  }

  const valueByQuestionId = new Map(submission.answers.map((a) => [a.questionId, a.value]));

  return (
    <>
      <AppHeader email={user.email} />
      <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
          Your answers
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Submitted on{" "}
          {submission.submittedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          .
        </p>

        <div className="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {survey.questions.map((question) => (
            <div key={question.id} className="px-6 py-5 sm:px-8">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {question.title}
              </p>
              <p className="mt-1 text-base text-zinc-900 dark:text-zinc-50">
                {valueByQuestionId.get(question.id) ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
