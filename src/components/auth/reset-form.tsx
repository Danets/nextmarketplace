"use client"

import { useState, useTransition } from "react"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetFormSchema } from "@/lib/schemas"
import { reset } from "@/app/actions/reset"

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

type Schema = z.infer<typeof ResetFormSchema>;

export const ResetForm = () => {
    const [error, SetError] = useState<string | undefined>('');
    const [success, SetSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const form = useForm<Schema>({
        resolver: zodResolver(ResetFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (data: Schema) => {
        SetError("");
        SetSuccess("");

        console.log("Reset form submitted with data:", data);

        startTransition(() => {
            reset(data)
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
            title='Reset Password'
            buttonLabel='Back to login'
            buttonHref='sign-in'
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

                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full hover:cursor-pointer"
                    >
                        Send Reset Email
                    </Button>
                    <ErrorToaster error={error} />
                    <SuccessToaster success={success} />
                </form>
            </Form>
        </CardWrapper>
    )
}