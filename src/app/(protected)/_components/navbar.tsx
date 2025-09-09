"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const path = usePathname();

    return (
        <nav>
            <div className="flex justify-between items-center w-full py-4">
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
        </nav>
    )
}
