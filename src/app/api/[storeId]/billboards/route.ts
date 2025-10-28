import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "../../../../../auth";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const billboards = await prisma.billboard.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(billboards, { status: 200 });
  } catch (error) {
    console.error("[BILLBOARDS_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const { storeId } = params;

    const body = await request.json();
    const { label, imageUrl } = body;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!label) {
      return new NextResponse("label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: session.user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prisma.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard, { status: 201 });
  } catch (error) {
    console.error("[BILLBOARDS_POST]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
