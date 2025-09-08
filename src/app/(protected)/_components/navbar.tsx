"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const path = usePathname();

    return (
        <nav>
            <ul className="flex justify-between items-center w-full py-4">
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
            </ul>
        </nav>
    )
}
