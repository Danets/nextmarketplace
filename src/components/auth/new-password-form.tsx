"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { NewPasswordFormSchema } from "@/lib/schemas"

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
import { newPassword } from "@/app/actions/new-password"

type Schema = z.infer<typeof NewPasswordFormSchema>;


export const NewPasswordForm = () => {
    const [error, SetError] = useState<string | undefined>('');
    const [success, SetSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const token = useSearchParams().get('token');

    const form = useForm<Schema>({
        resolver: zodResolver(NewPasswordFormSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmit = (data: Schema) => {
        SetError("");
        SetSuccess("");

        console.log("Reset form submitted with data:", data);

        startTransition(() => {
            newPassword(data, token)
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
            title='Enter New Password'
            buttonLabel='Back to login'
            buttonHref='sign-in'
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder='****' {...field} />
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
                        Confirm New Password
                    </Button>
                    <ErrorToaster error={error} />
                    <SuccessToaster success={success} />
                </form>
            </Form>
        </CardWrapper>
    )
}