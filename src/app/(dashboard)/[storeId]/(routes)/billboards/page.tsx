import { prisma } from "@/lib/db";
import { format } from "date-fns";

import { BillboardClient } from "./_components/billboard-client";
import { BillboardColumn } from "./_components/columns";

export default async function BillboardsPage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;

    const billboards = await prisma.billboard.findMany({
        where: { storeId },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
        id: billboard.id,
        label: billboard.label,
        createdAt: format(billboard.createdAt, "MMMM do, yyyy")
    })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient billboards={formattedBillboards} />
            </div>
        </div>
    )
}