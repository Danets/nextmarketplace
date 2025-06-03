"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { RegisterFormSchema } from "@/lib/schemas"
import { register } from "@/app/actions/register"
import { startTransition, useActionState } from "react"

type Schema = z.infer<typeof RegisterFormSchema>;

export const RegisterForm = () => {
    const form = useForm<Schema>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const [state, action, pending] = useActionState(
        async (_state: { message: string } | undefined, formData: FormData) => {
            const values = {
                username: formData.get("username") as string,
                email: formData.get("email") as string,
                password: formData.get("password") as string,
            };
            return await register(values);
        },
        undefined
    );

    const onSubmit = (data: Schema) => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("password", data.password);

        startTransition(() => {
            action(formData);
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
                    <div>{state?.message}</div>
                </form>
            </Form>
        </CardWrapper>
    )
}