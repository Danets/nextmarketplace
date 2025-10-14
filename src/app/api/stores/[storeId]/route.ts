import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "../../../../../auth";

export async function PATCH(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const { storeId } = params;

    const body = await request.json();
    const { name } = body;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prisma.store.updateMany({
      where: {
        id: storeId,
        userId: session.user.id,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store, { status: 202 });
  } catch (error) {
    console.error("[STORES_STOREID_PATCH]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await auth();
    const { storeId } = params;

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    const store = await prisma.store.deleteMany({
      where: {
        id: storeId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(store, { status: 202 });
  } catch (error) {
    console.error("[STORES_STOREID_DELETE]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
