import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/app/(protected)/_components/navbar";

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const { storeId } = await params;

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
        <>
            <Navbar />
            <h2>{store.name}</h2>
            {children}
        </>
    );
}