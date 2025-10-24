import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { BillboardForm } from "../_components/billboard-form";

export default async function BillboardDetailedPage({ params }: { params: Promise<{ billboardId: string }> }) {
    const billboardId = (await params).billboardId;

    if (!billboardId) {
        redirect("/");
    }

    const billBoard = await prisma.billboard.findUnique({
        where: {
            id: billboardId,
        },
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4">
                <BillboardForm initialData={billBoard} />
            </div>
        </div>)
}
