import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyWithQuestions, getSubmissionWithAnswers } from "@/lib/survey";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ errors: { form: "Not authenticated." } }, { status: 401 });
  }

  const survey = await getSurveyWithQuestions();
  const submission = await getSubmissionWithAnswers(user.id, survey.id);

  return NextResponse.json({
    survey: {
      id: survey.id,
      title: survey.title,
      description: survey.description,
    },
    questions: survey.questions.map((q) => ({
      id: q.id,
      key: q.key,
      position: q.position,
      title: q.title,
      description: q.description,
      type: q.type,
      options: q.options.map((o) => ({ id: o.id, label: o.label, position: o.position })),
    })),
    hasSubmitted: submission !== null,
  });
}
