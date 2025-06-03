import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email, password } = body;

  const isEmailExists = await prisma.user.findUnique({
    where: { email },
  });

  if (!isEmailExists) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(user);
}
