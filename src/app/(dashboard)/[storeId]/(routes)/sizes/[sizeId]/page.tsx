import { prisma } from "@/lib/db";
import { SizeForm } from "../_components/size-form";

export default async function SizeDetailedPage({ params }: { params: Promise<{ sizeId: string }> }) {
    const sizeId = (await params).sizeId;

    const size = await prisma.size.findUnique({
        where: {
            id: sizeId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4">
                <SizeForm initialData={size} />
            </div>
        </div>)
}
