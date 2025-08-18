"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

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
        },
    });

    const onSubmit = (data: Schema) => {
        SetError("");
        SetSuccess("");
        startTransition(() => {
            login(data)
                .then((response) => {
                    SetError(response.error);
                    SetSuccess(response.success);
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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='email' {...field} />
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
                                    <Input type="password" placeholder='******' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full hover:cursor-pointer"
                    >
                        Login
                    </Button>
                    <ErrorToaster error={error || urlError} />
                    <SuccessToaster success={success} />
                </form>
            </Form>
        </CardWrapper>
    )
}