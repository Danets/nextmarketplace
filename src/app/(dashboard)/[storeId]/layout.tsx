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
        <div className="min-h-screen w-full bg-sky-500">
            <div className="w-11/12 mx-auto flex-col justify-center items-center gap-2">
                <header>
                    <Navbar />
                </header>
                <main>
                    <h3>Store Name: {store.name}</h3>
                    {children}
                </main>
                <footer></footer>
            </div>
        </div >
    );
}