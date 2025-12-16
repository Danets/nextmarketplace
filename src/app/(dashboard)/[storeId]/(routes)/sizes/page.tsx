import { prisma } from "@/lib/db";
import { format } from "date-fns";

import { SizesClient } from "./_components/size-client";
import { SizeColumn } from "./_components/columns";

export default async function SizesPage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;

    const sizes = await prisma.size.findMany({
        where: { storeId },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedSizes: SizeColumn[] = sizes.map((size) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        createdAt: format(size.createdAt, "MMMM do, yyyy")
    })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient sizes={formattedSizes} />
            </div>
        </div>
    )
}