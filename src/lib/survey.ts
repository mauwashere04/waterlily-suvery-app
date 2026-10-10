import { prisma } from "@/lib/db";

// There's exactly one seeded survey (a locked decision in CONTEXT.md), so
// callers just need "the" survey rather than looking one up by id.
export async function getSurveyWithQuestions() {
  const survey = await prisma.survey.findFirst({
    include: {
      questions: {
        orderBy: { position: "asc" },
        include: { options: { orderBy: { position: "asc" } } },
      },
    },
  });

  if (!survey) {
    throw new Error("No survey has been seeded. Run `npm run seed`.");
  }

  return survey;
}

export function getSubmissionWithAnswers(userId: string, surveyId: string) {
  return prisma.submission.findUnique({
    where: { userId_surveyId: { userId, surveyId } },
    include: { answers: true },
  });
}
