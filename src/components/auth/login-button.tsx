"use client"

import { useRouter } from "next/navigation";

interface LoginButtonProps {
    mode?: "modal" | "redirect";
    asChild?: boolean;
    children: React.ReactNode;
}

const LoginButton = ({
    mode = "redirect",
    children,
}: LoginButtonProps) => {
    const router = useRouter();

    const handleLogin = () => {
        if (mode === "modal") {
            // Open modal logic here
            console.log("Open login modal");
        } else {
            router.push("/sign-in");
        }
    }
    return (
        <span className="cursor-pointer" onClick={handleLogin}>
            {children}
        </span>
    )
}

export default LoginButton