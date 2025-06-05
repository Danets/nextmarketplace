"use client"

import { useState, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { RegisterFormSchema } from "@/lib/schemas"
import { register } from "@/app/actions/register"


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
import { CardWrapper } from "@/components/auth/card-wrapper"
import { ErrorToaster } from "@/components/error-toaster"
import { SuccessToaster } from "@/components/success-toaster"

type Schema = z.infer<typeof RegisterFormSchema>;

export const RegisterForm = () => {
    const [error, SetError] = useState<string | undefined>('');
    const [success, SetSuccess] = useState<string | undefined>('');
    const [pending, startTransition] = useTransition();

    const form = useForm<Schema>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: Schema) => {
        SetError("");
        SetSuccess("");
        startTransition(() => {
            register(data)
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
            buttonLabel='Do you have an account?'
            buttonHref='sign-in'
            includeIcons
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder='username' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
                    <Button disabled={pending} type="submit" className="w-full">Register</Button>
                    <ErrorToaster error={error} />
                    <SuccessToaster success={success} />
                </form>
            </Form>
        </CardWrapper>
    )
}