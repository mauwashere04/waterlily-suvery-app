import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, createSessionForUser } from "@/lib/auth";

const GENERIC_ERROR = "Email or password is incorrect.";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errors: { form: "Invalid request." } },
      { status: 400 }
    );
  }

  const { email, password } = (body ?? {}) as {
    email?: string;
    password?: string;
  };

  const normalizedEmail = (email ?? "").trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return NextResponse.json(
      { errors: { form: GENERIC_ERROR } },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  // Same response whether the email is unknown or the password is wrong --
  // revealing "no account with that email" would let someone enumerate
  // registered addresses one guess at a time.
  if (!user) {
    return NextResponse.json(
      { errors: { form: GENERIC_ERROR } },
      { status: 400 }
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { errors: { form: GENERIC_ERROR } },
      { status: 400 }
    );
  }

  await createSessionForUser(user.id);

  return NextResponse.json({ ok: true });
}
