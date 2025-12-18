import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "../../../../../../auth";

export async function GET(
  request: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const { sizeId } = params;

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
    }

    const size = await prisma.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.error("[SIZE_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const session = await auth();
    const { storeId, sizeId } = params;
    const body = await request.json();
    const { name, value } = body;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
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

    const size = await prisma.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size, { status: 202 });
  } catch (error) {
    console.error("[SIZES_PATCH]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const session = await auth();
    const { storeId, sizeId } = params;
    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
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

    const size = await prisma.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 202 });
  } catch (error) {
    console.error("[SIZES_DELETE]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
