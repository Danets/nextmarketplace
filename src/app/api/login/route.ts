import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and Passord are required!" },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "Login successful" }, { status: 200 });
}
