import { prisma } from "@/lib/db";
import { ColorForm } from "../_components/color-form";

export default async function ColorDetailedPage({ params }: { params: Promise<{ colorId: string }> }) {
    const colorId = (await params).colorId;

    const color = await prisma.color.findUnique({
        where: {
            id: colorId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4">
                <ColorForm initialData={color} />
            </div>
        </div>)
}
