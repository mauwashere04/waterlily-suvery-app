import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyWithQuestions, getSubmissionWithAnswers } from "@/lib/survey";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const survey = await getSurveyWithQuestions();
  const submission = await getSubmissionWithAnswers(user.id, survey.id);

  redirect(submission ? "/review" : "/survey");
}
