import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SURVEY = {
  title: "Long-term care intake",
  description: "A short form about your household, health, and finances.",
};

type QuestionSeed = {
  key: string;
  title: string;
  description: string;
  type: "text" | "number" | "single";
  options?: string[];
};

const QUESTIONS: QuestionSeed[] = [
  {
    key: "age",
    title: "How old are you?",
    description: "Age in years.",
    type: "number",
  },
  {
    key: "state",
    title: "What state do you live in?",
    description: "Use the two-letter abbreviation, such as CA.",
    type: "text",
  },
  {
    key: "householdSize",
    title: "How many people live in your household, including you?",
    description: "Count everyone who lives with you.",
    type: "number",
  },
  {
    key: "maritalStatus",
    title: "What is your marital status?",
    description: "Pick the option that fits best.",
    type: "single",
    options: ["Single", "Married", "Partnered", "Divorced", "Widowed"],
  },
  {
    key: "overallHealth",
    title: "How would you rate your overall health?",
    description: "Your own read, not a diagnosis.",
    type: "single",
    options: ["Excellent", "Good", "Fair", "Poor"],
  },
  {
    key: "chronicCondition",
    title: "Do you have a chronic health condition?",
    description:
      "Examples include diabetes, heart disease, or a long-term breathing condition.",
    type: "single",
    options: ["Yes", "No"],
  },
  {
    key: "mobilityLimitation",
    title: "Do you have a condition that limits your mobility?",
    description:
      "This includes trouble walking, climbing stairs, or getting in and out of a chair.",
    type: "single",
    options: ["Yes", "No"],
  },
  {
    key: "tobaccoUse",
    title: "Do you currently use tobacco?",
    description: "Cigarettes, cigars, or vaping.",
    type: "single",
    options: ["Yes", "No"],
  },
  {
    key: "incomeRange",
    title: "What is your household income?",
    description: "Total household income for last year, before taxes.",
    type: "single",
    options: [
      "Under $50,000",
      "$50,000–$99,999",
      "$100,000–$149,999",
      "$150,000 or more",
      "Prefer not to say",
    ],
  },
  {
    key: "ltcInsurance",
    title: "Do you have long-term care insurance?",
    description:
      "A policy meant to help pay for future care, separate from regular health insurance.",
    type: "single",
    options: ["Yes", "No"],
  },
];

async function main() {
  const survey = await prisma.survey.upsert({
    where: { id: "seed-survey-long-term-care-intake" },
    update: {
      title: SURVEY.title,
      description: SURVEY.description,
    },
    create: {
      id: "seed-survey-long-term-care-intake",
      title: SURVEY.title,
      description: SURVEY.description,
    },
  });

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const position = i + 1;

    const question = await prisma.question.upsert({
      where: { surveyId_key: { surveyId: survey.id, key: q.key } },
      update: {
        position,
        title: q.title,
        description: q.description,
        type: q.type,
      },
      create: {
        surveyId: survey.id,
        key: q.key,
        position,
        title: q.title,
        description: q.description,
        type: q.type,
      },
    });

    // Re-seeding should not duplicate options: clear and reinsert this
    // question's options rather than trying to diff them individually.
    await prisma.questionOption.deleteMany({
      where: { questionId: question.id },
    });

    if (q.options) {
      await prisma.questionOption.createMany({
        data: q.options.map((label, index) => ({
          questionId: question.id,
          label,
          position: index + 1,
        })),
      });
    }
  }

  console.log(`Seeded survey "${survey.title}" with ${QUESTIONS.length} questions.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
