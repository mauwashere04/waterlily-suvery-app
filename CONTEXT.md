# Waterlily survey app — context

Read this file before writing code. Then follow `TASKS.md` in order.

## What this is

A 2 hour 30 minute take-home. Build a simplified version of Waterlily’s user intake form. A logged-in person answers a short set of demographic, health, and financial questions, submits once, and can review their own answers.

Waterlily uses answers like these in a model that predicts long-term care needs and costs. This project only collects and stores the answers. It does not predict costs, quote insurance, or score risk.

The person building this must be able to explain each decision out loud. Keep the code small enough to narrate. Ship a working version 1 before any extra feature.

The question list below is the agreed version 1 set. Use it as written. Do not research Waterlily’s live app for more questions.

## Locked decisions

- Time box: 2 hours 30 minutes. Stop extra work when that is gone.
- One app: Next.js (App Router) + TypeScript + Tailwind.
- API routes live in the same Next.js app.
- Database: SQLite through Prisma. Real relational tables. Explain the schema in a comment at the top of `prisma/schema.prisma`.
- Auth is custom. Email + password. Passwords hashed with bcrypt. Session stored in the database and sent as an httpOnly cookie.
- Do not use Clerk, Supabase, Auth.js, NextAuth, or any hosted auth product.
- One seeded survey. Questions are fixed in a seed script. There is no question builder and no admin UI.
- One submission per user. A second submit is rejected. After submit, the survey route shows a completed state and a link to the review page.
- Version 1 is one scrolling page: every question visible, one submit button at the bottom.
- The survey and the review page require a session. Sign up and log in are public.

## What the brief requires

Frontend:

- Question title
- Question description
- Input for the answer
- Submit button
- Post-submission review of that user’s answers
- Responsive layout that looks finished, not like a default starter

Backend:

- Endpoints that load the survey and save a submission
- SQL storage

Auth:

- Sign up, log in, log out
- Protected survey and review

## Version 1 questions

Ten questions, in this order. They cover the three areas the brief names: demographic, health, and financial.

Survey title: “Long-term care intake”.
Survey description: “A short form about your household, health, and finances.”

| # | Key | Title | Description | Type | Options / rules |
| --- | --- | --- | --- | --- | --- |
| 1 | age | How old are you? | Age in years. | number | integer, 18–120 |
| 2 | state | What state do you live in? | Use the two-letter abbreviation, such as CA. | text | 2 letters |
| 3 | householdSize | How many people live in your household, including you? | Count everyone who lives with you. | number | integer, minimum 1 |
| 4 | maritalStatus | What is your marital status? | Pick the option that fits best. | single | Single, Married, Partnered, Divorced, Widowed |
| 5 | overallHealth | How would you rate your overall health? | Your own read, not a diagnosis. | single | Excellent, Good, Fair, Poor |
| 6 | chronicCondition | Do you have a chronic health condition? | Examples include diabetes, heart disease, or a long-term breathing condition. | single | Yes, No |
| 7 | mobilityLimitation | Do you have a condition that limits your mobility? | This includes trouble walking, climbing stairs, or getting in and out of a chair. | single | Yes, No |
| 8 | tobaccoUse | Do you currently use tobacco? | Cigarettes, cigars, or vaping. | single | Yes, No |
| 9 | incomeRange | What is your household income? | Total household income for last year, before taxes. | single | Under $50,000; $50,000–$99,999; $100,000–$149,999; $150,000 or more; Prefer not to say |
| 10 | ltcInsurance | Do you have long-term care insurance? | A policy meant to help pay for future care, separate from regular health insurance. | single | Yes, No |

Signup collects email and password. The survey does not ask for them again.

## Data model

```
User
  id, email (unique), passwordHash, createdAt

Session
  id, userId, tokenHash, expiresAt, createdAt

Survey
  id, title, description

Question
  id, surveyId, key, position, title, description, type
  type is one of: text, number, single

QuestionOption
  id, questionId, label, position
  only used when type is single

Submission
  id, userId, surveyId, submittedAt
  unique on (userId, surveyId)

Answer
  id, submissionId, questionId, value
  unique on (submissionId, questionId)
  value is a string for every type
```

Why this shape:

- Questions belong to one survey so a second survey could be added later without new tables.
- Options are rows, so choice lists stay queryable.
- One submission per user is enforced in the database, not only in the UI.
- One answer row per question keeps the review page a simple join.
- Index `Session.tokenHash`, `Question.surveyId`, and `Answer.submissionId`.

## Routes

- `/` — if logged out, send to `/login`. If logged in and no submission, send to `/survey`. If a submission exists, send to `/review`.
- `/signup` — email, password, confirm password.
- `/login` — email, password.
- `/survey` — the form. Protected.
- `/review` — that user’s answers, with question titles. Protected.
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/survey` — questions, plus the existing submission if any
- `POST /api/survey/submit` — create the submission and answers

## Auth behavior

- Password minimum 8 characters.
- Duplicate email returns a field error, not a stack trace.
- Wrong login returns one message: “Email or password is incorrect.”
- Session cookie is httpOnly, SameSite=Lax, and expires in 7 days.
- Store only a hash of the session token.
- Logging out deletes the session row and clears the cookie.

## UI

- Calm, readable form. Plenty of space between questions. Works on a phone width.
- Each question shows its title, the description underneath, then the control.
- Single choice is a radio group. Numbers use a number input. State uses a text input.
- Submit sits at the end of the page.
- Review is a list of question title plus the saved answer.
- Empty, error, and already-submitted states are visible. No spinner-only screens with no text.

## Out of scope

Question builder, admin dashboard of all users, email verification, password reset, editing answers, file upload, care-cost prediction, and insurance quotes.
