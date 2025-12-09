import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "../../../../../../auth";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("[CATEGORY_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const session = await auth();
    const { storeId, categoryId } = params;

    const body = await request.json();
    const { name, billboardId } = body;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
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

    const category = await prisma.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category, { status: 202 });
  } catch (error) {
    console.error("[CATEGORIES_PATCH]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const session = await auth();
    const { storeId, categoryId } = params;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
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

    const category = await prisma.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category, { status: 202 });
  } catch (error) {
    console.error("[CATEGORIES_DELETE]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
