import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();

    const body = await request.json();
    const { name } = body;

    if (!session?.user) {
      //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const store = await prisma.store.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("[STORES_POST]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
