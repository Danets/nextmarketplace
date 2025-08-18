"use client"

import { ErrorCard } from "@/components/auth/error-card"
import { useSearchParams } from "next/navigation"

enum Error {
    Configuration = "Configuration",
}

const errorMap = {
    [Error.Configuration]: (
        <p>
            There was a problem when trying to authenticate. Please contact us if this
            error persists. Unique error code:{" "}
            <code className="rounded-sm bg-slate-100 p-1 text-xs">Configuration</code>
        </p>
    ),
}

export default function AuthErrorPage() {
    const search = useSearchParams()
    const error = search.get("error") as Error

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center">
            <ErrorCard> {errorMap[error] || "Please contact us if this error persists."}</ErrorCard>
        </div>
    )
}