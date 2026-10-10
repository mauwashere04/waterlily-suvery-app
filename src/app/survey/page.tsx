import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyWithQuestions, getSubmissionWithAnswers } from "@/lib/survey";
import { AppHeader } from "@/components/AppHeader";
import { SurveyWizard } from "@/components/survey/SurveyWizard";
import type { SurveyQuestion } from "@/types/survey";

export default async function SurveyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const survey = await getSurveyWithQuestions();
  const submission = await getSubmissionWithAnswers(user.id, survey.id);

  // Task 10: a return visit to /survey after already submitting goes
  // straight to /review instead of showing a completed-state screen here.
  if (submission) {
    redirect("/review");
  }

  const questions: SurveyQuestion[] = survey.questions.map((q) => ({
    id: q.id,
    key: q.key,
    position: q.position,
    title: q.title,
    description: q.description,
    type: q.type as SurveyQuestion["type"],
    options: q.options.map((o) => ({ id: o.id, label: o.label, position: o.position })),
  }));

  return (
    <>
      <AppHeader email={user.email} />
      <SurveyWizard
        survey={{ id: survey.id, title: survey.title, description: survey.description }}
        questions={questions}
      />
    </>
  );
}
