import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "../../../../../../auth";
import { DashboardSettingsForm } from "./_components/dashboard-settings-form";

export default async function DashboardSettingsPage({ params }: { params: Promise<{ storeId: string }> }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const storeId = (await params).storeId;

    if (!storeId) {
        redirect("/");
    }

    const store = await prisma.store.findFirst({
        where: {
            id: storeId,
            userId: session.user.id,
        },
    });

    if (!store) {
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4">
                <DashboardSettingsForm initialData={store} />
            </div>
        </div>
    )
}
