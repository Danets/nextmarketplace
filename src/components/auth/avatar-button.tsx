"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { FaUser } from "react-icons/fa";
import { useCurrentUser } from "../../../hooks/use-current-user";
import { LogoutButton } from "./logout-button";

export const AvatarButton = () => {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""} className="w-16 h-16 cursor-pointer rounded-md" />
                    <AvatarFallback asChild>
                        <div className="bg-sky-500 cursor-pointer flex items-center justify-center rounded-md p-6">
                            <FaUser className="text-black" />
                        </div>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <LogoutButton>Logout</LogoutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}