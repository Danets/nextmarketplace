"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { CardWrapper } from "@/components/auth/card-wrapper"
import { ErrorToaster } from "@/components/error-toaster"
import { SuccessToaster } from "@/components/success-toaster"

import { FadeLoader } from "react-spinners";
import { verify } from "@/app/actions/verification"

export const VerificationForm = () => {
    const [error, SetError] = useState<string | undefined>('');
    const [success, SetSuccess] = useState<string | undefined>('');

    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const onSubmit = useCallback(async () => {
        if (!token) {
            SetError("Missing token");
            return;
        }

        const result = await verify(token)
        SetSuccess(result.success);
        SetError(result.error);

    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            title='Confirm your email'
            buttonLabel='Back to Sign In'
            buttonHref='sign-in'
        >
            <div className="flex items-center justify-center w-full">
                {!success && !error &&
                    <FadeLoader />
                }
                <ErrorToaster error={error} />
                <SuccessToaster success={success} />
            </div>
        </CardWrapper>
    )
}