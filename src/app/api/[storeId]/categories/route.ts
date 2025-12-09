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

    const categories = await prisma.category.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);

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
    const { name, billboardId } = body;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("billboardId is required", { status: 400 });
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

    const category = await prisma.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
