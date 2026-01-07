import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "../../../../../../auth";

export async function GET(
  request: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const { colorId } = params;

    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    const color = await prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.error("[COLOR_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const session = await auth();
    const { storeId, colorId } = params;
    const body = await request.json();
    const { name, value } = body;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("value is required", { status: 400 });
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

    const color = await prisma.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color, { status: 202 });
  } catch (error) {
    console.error("[COLORS_PATCH]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const session = await auth();
    const { storeId, colorId } = params;
    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is required", { status: 400 });
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

    const color = await prisma.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 202 });
  } catch (error) {
    console.error("[COLORS_DELETE]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
