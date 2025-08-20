"use client"

import { FaGoogle, FaGithub } from "react-icons/fa"
import { Button } from "../ui/button"
import { signIn } from "next-auth/react"
import { DEFAULT_REDIRECT } from "../../../routes"

export const SocialIcons = () => {

    const onLogin = (provider: "google" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_REDIRECT
        });
    }
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Button className="shadow hover:cursor-pointer" variant="outline" size="lg" onClick={() => onLogin("google")}>
                <FaGoogle className="h-4 w-4" />
                Google
            </Button>
            <Button className="shadow hover:cursor-pointer" variant="outline" size="lg" onClick={() => onLogin("github")}>
                <FaGithub className="h-4 w-4" />
                GitHub
            </Button>
        </div>)
}

