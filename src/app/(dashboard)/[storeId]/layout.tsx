import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/db";
import { Navbar } from "@/components/navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const stores = await prisma.store.findMany({
        where: {
            userId: session.user.id,
        },
    });

    return (
        <div className="min-h-screen w-full bg-sky-500">
            <div className="w-11/12 mx-auto flex-col justify-center items-center gap-2">
                <header>
                    <Navbar stores={stores} />
                </header>
                <main>
                    {children}
                </main>
                <footer></footer>
            </div>
        </div >
    );
}