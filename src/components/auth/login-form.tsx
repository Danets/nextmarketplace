"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { LoginFormSchema } from "@/lib/schemas"
import { login } from "@/app/actions/login"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CardWrapper } from "./card-wrapper"
import { ErrorToaster } from "@/components/error-toaster"
import { SuccessToaster } from "@/components/success-toaster"

type Schema = z.infer<typeof LoginFormSchema>;

export const LoginForm = () => {
    const [twoFactor, setTwoFactor] = useState(false);
    const [error, SetError] = useState<string | undefined>('');
    const [success, SetSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const search = useSearchParams()
    const urlError = search.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use. Please login with different provider."
        : "";

    const form = useForm<Schema>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
            code: "",
        },
    });

    const onSubmit = (data: Schema) => {
        SetError("");
        SetSuccess("");
        startTransition(() => {
            login(data)
                .then((response) => {
                    if (response.error) {
                        form.reset()
                        SetError(response.error);

                    }
                    if (response.success) {
                        form.reset()
                        SetSuccess(response.success);

                    }
                    if (response.twoFactor) {
                        setTwoFactor(true);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        })
    }

    return (
        <CardWrapper
            title='Welcome back'
            buttonLabel='Do not have an account?'
            buttonHref='sign-up'
            includeIcons
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        {twoFactor && (
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder='123456' {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!twoFactor && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder='email' {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder='****' {...field} disabled={isPending} />
                                            </FormControl>
                                            <Button
                                                size="sm"
                                                variant="link"
                                                asChild
                                                className="px-0 font-normal"
                                            >
                                                <Link href="/reset" className="text-sm">
                                                    Forgot password?
                                                </Link>
                                            </Button>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </div>
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full hover:cursor-pointer"
                    >
                        {twoFactor ? "Confirm" : "Login"}
                    </Button>
                    <ErrorToaster error={error || urlError} />
                    <SuccessToaster success={success} />
                </form>
            </Form>
        </CardWrapper>
    )
}