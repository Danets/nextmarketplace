"use client"

import { FaGoogle, FaGithub } from "react-icons/fa"
import { Button } from "../ui/button"

export const SocialIcons = () => {
    return (
        <div className="flex items-center justify-between gap-x-2 w-full">
            <Button className="shadow" variant="outline" size="lg" onClick={() => { }}>
                <FaGoogle className="h-4 w-4" />
                Google
            </Button>
            <Button className="shadow" variant="outline" size="lg" onClick={() => { }}>
                <FaGithub className="h-4 w-4" />
                GitHub
            </Button>
        </div>)
}

