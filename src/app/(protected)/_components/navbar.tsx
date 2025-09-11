"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AvatarButton } from "@/components/auth/avatar-button";

export const Navbar = () => {
    const path = usePathname();

    return (
        <nav className="flex items-center justify-between bg-white rounded-md space-y-2 px-2">
            <div className="flex items-center py-4 gap-x-2">
                <Button
                    asChild
                    variant={path === "/" ? "default" : "ghost"}
                >
                    <Link href="/">Home</Link>
                </Button>
                <Button
                    asChild
                    variant={path === "/settings" ? "default" : "ghost"}

                >
                    <Link href="/settings">Settings</Link>
                </Button>
            </div>
            <AvatarButton />
        </nav>
    )
}
