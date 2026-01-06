import { prisma } from "@/lib/db";
import { format } from "date-fns";

import { ColorsClient } from "./_components/color-client";
import { ColorColumn } from "./_components/columns";

export default async function ColorsPage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;

    const colors = await prisma.color.findMany({
        where: { storeId },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedColors: ColorColumn[] = colors.map((color) => ({
        id: color.id,
        name: color.name,
        value: color.value,
        createdAt: format(color.createdAt, "MMMM do, yyyy")
    })
    );

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient colors={formattedColors} />
            </div>
        </div>
    )
}