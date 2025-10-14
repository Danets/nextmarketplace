import { redirect } from "next/navigation";
import { auth } from "../../../auth"
import { prisma } from "@/lib/db";

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/sign-in");
    }

    const store = await prisma.store.findFirst({
        where: {
            userId: session.user.id,
        },
    });

    if (store) {
        redirect(`/${store.id}/settings`);
    }

    return (
        <>
            {children}
        </>
    )
}
