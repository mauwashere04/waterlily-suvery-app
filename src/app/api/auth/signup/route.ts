import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSessionForUser } from "@/lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const { email, password, confirmPassword } = (body ?? {}) as {
    email?: string;
    password?: string;
    confirmPassword?: string;
  };

  const errors: Record<string, string> = {};

  const normalizedEmail = (email ?? "").trim().toLowerCase();
  if (!normalizedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(normalizedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (password && confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    return NextResponse.json(
      { errors: { email: "An account with this email already exists." } },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password as string);
  const user = await prisma.user.create({
    data: { email: normalizedEmail, passwordHash },
  });

  await createSessionForUser(user.id);

  return NextResponse.json({ ok: true });
}
