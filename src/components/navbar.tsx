"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { AvatarButton } from "@/components/auth/avatar-button";
import { StoreSwitcher } from "@/components/store-switcher";
import { Store } from "@prisma/client";

interface NavbarProps {
    stores?: Store[];
}

export const Navbar = ({ stores }: NavbarProps) => {

    const path = usePathname();
    const { storeId } = useParams();

    const links = [
        {
            href: storeId ? `/${storeId}/settings` : "/",
            label: "Store Settings",
            active: path === `/${storeId}/settings` ? "default" : "ghost"
        },
        {
            href: `/${storeId}/billboards`,
            label: "Billboards",
            active: path === `/${storeId}/billboards` ? "default" : "ghost"
        },
        {
            href: "/settings",
            label: "User Settings",
            active: path === "/settings" ? "default" : "ghost"
        },
    ]

    return (
        <nav className="flex items-center justify-between bg-blue-500 rounded-md space-y-2 px-4">
            <div className="flex items-center py-4 gap-x-2">
                {path === `/${storeId}/settings` && <StoreSwitcher stores={stores!} />}
                {links.map((link) => (
                    <Button
                        key={link.href}
                        asChild
                        variant={link.active}
                    >
                        <Link href={link.href}>{link.label}</Link>
                    </Button>
                ))}
            </div>
            <AvatarButton />
        </nav>
    )
}
