import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyWithQuestions, getSubmissionWithAnswers } from "@/lib/survey";
import { validateAnswer, normalizeAnswerValue } from "@/lib/validation";
import { sendSubmissionEmails } from "@/lib/email";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ errors: { form: "Not authenticated." } }, { status: 401 });
  }

  const survey = await getSurveyWithQuestions();

  const existing = await getSubmissionWithAnswers(user.id, survey.id);
  if (existing) {
    return NextResponse.json(
      { errors: { form: "You already submitted this survey." } },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ errors: { form: "Invalid request." } }, { status: 400 });
  }

  const answersInput = ((body ?? {}) as { answers?: Record<string, string> }).answers ?? {};

  const errors: Record<string, string> = {};
  const normalizedAnswers: { questionId: string; value: string }[] = [];

  for (const question of survey.questions) {
    const raw = answersInput[question.id];
    const error = validateAnswer(question, raw);
    if (error) {
      errors[question.id] = error;
      continue;
    }
    normalizedAnswers.push({
      questionId: question.id,
      value: normalizeAnswerValue(question, raw as string),
    });
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const submission = await tx.submission.create({
        data: { userId: user.id, surveyId: survey.id },
      });
      await tx.answer.createMany({
        data: normalizedAnswers.map((a) => ({
          submissionId: submission.id,
          questionId: a.questionId,
          value: a.value,
        })),
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { errors: { form: "You already submitted this survey." } },
        { status: 400 }
      );
    }
    throw error;
  }

  await sendSubmissionEmails({
    userEmail: user.email,
    answers: normalizedAnswers.map((a) => ({
      title: survey.questions.find((q) => q.id === a.questionId)?.title ?? a.questionId,
      value: a.value,
    })),
  });

  return NextResponse.json({ ok: true });
}
