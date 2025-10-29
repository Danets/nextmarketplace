import { prisma } from "@/lib/db";
import { BillboardClient } from "./_components/billboard-client";

export default async function BillboardsPage({ params }: { params: { storeId: string } }) {
    const { storeId } = params;

    const billboards = await prisma.billboard.findMany({
        where: { storeId },
        orderBy: {
            createdAt: "desc"
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient billboards={billboards} />
            </div>
        </div>
    )
}