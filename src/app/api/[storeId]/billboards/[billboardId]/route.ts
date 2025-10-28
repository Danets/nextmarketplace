import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "../../../../../../auth";

export async function GET(
  request: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    const { billboardId } = params;

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.error("[BILLBOARD_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const session = await auth();
    const { storeId, billboardId } = params;

    const body = await request.json();
    const { label, imageUrl } = body;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard, { status: 202 });
  } catch (error) {
    console.error("[BILLBOARDS_PATCH]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const session = await auth();
    const { storeId, billboardId } = params;

    if (!session?.user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard, { status: 202 });
  } catch (error) {
    console.error("[BILLBOARDS_DELETE]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
