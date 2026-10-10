# Waterlily survey app — tasks

Read `CONTEXT.md` first. Do these tasks in order. Do not start a later task while the current one is broken.

Time box is 2 hours 30 minutes. Tasks 1–7 are version 1. Tasks 8–11 are extra, and only if version 1 already works end to end.

Use the 10 questions in `CONTEXT.md`. Do not add questions, and do not look up Waterlily’s live form.

Check a task only when the acceptance lines under it are true.

## 1. Scaffold

Create the Next.js app in this folder with TypeScript, Tailwind, the App Router, and Prisma pointed at a local SQLite file.

- `npm run dev` serves the app.
- `npx prisma migrate dev` creates the database from the schema in `CONTEXT.md`.
- `.env` is gitignored. `.env.example` lists `DATABASE_URL` with a placeholder.

## 2. Seed the intake

Write `prisma/seed.ts` that inserts one survey, the 10 questions, and the choice options from `CONTEXT.md`.

- Running the seed twice does not duplicate the survey or the questions.
- Question `position` is 1 through 10 in the table order.
- Single-choice questions have the options listed in `CONTEXT.md`. Number and text questions have no options.

## 3. Auth

Sign up, log in, and log out with the session rules in `CONTEXT.md`.

- `POST /api/auth/signup` creates a user with a bcrypt hash and sets the session cookie.
- Duplicate email shows a form error.
- Password shorter than 8 characters is rejected.
- `POST /api/auth/login` rejects unknown email and wrong password with the same message.
- `POST /api/auth/logout` deletes the session and clears the cookie.
- `/survey` and `/review` redirect to `/login` when there is no session.
- `/signup` and `/login` are usable on a phone-width screen.

## 4. Survey page

`GET /api/survey` returns the seeded questions in order, with options, for the logged-in user.

- `/survey` renders title, description, and the right control for each type.
- The page is one scrolling form with a submit button at the end.
- A user who already submitted does not see an empty form. They see a short completed message and a link to `/review`.

## 5. Submit

`POST /api/survey/submit` writes one `Submission` and one `Answer` per question.

- The unique constraint on `(userId, surveyId)` blocks a second submission.
- Every answer is stored as a string.
- Missing answers return a 400 with a message the form can show.
- After a successful submit, the browser lands on `/review`.

## 6. Review

`/review` lists this user’s answers only.

- Each row shows the question title and the saved value.
- Another user’s submission is never returned.
- A user with no submission is sent to `/survey`.

## 7. Finish version 1

Make the form and review page look intentional at desktop and at 375px wide.

- Labels, descriptions, inputs, and the submit button have clear spacing.
- Auth errors and the already-submitted state are plain text, not only color.
- `npm run build` succeeds.
- Manual check: sign up, answer all 10 questions, submit, refresh `/review`, log out, log back in, and still see the same answers.

Stop here if the time box is tight. Version 1 is the submission.

## 8. Extra — validation

Only after task 7.

- Age is an integer from 18 to 120.
- State is exactly two letters.
- Household size is an integer of at least 1.
- Every question is required.
- Errors appear next to the field.

## 9. Extra — one question at a time

Only after task 8, and only if at least 30 minutes remain.

- The survey shows one question.
- Next and Previous move between questions without losing answers.
- A progress label shows the current position, such as “4 of 10”.
- Submit appears on the last question.

## 10. Extra — return visit

- Opening `/survey` after a submission redirects to `/review`.

## 11. Extra — auth polish

- Password fields can be shown or hidden.
- Signup shows which rule failed (length, mismatch, duplicate email) next to the field.

## Do not build

Question builder, admin list of all submissions, email verification, password reset, edit-after-submit, file upload, cost prediction, insurance quotes, Clerk, or Supabase.
