"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CategoryFormSchema } from "@/lib/schemas"

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
import { ErrorToaster } from "@/components/error-toaster"
import { SuccessToaster } from "@/components/success-toaster"

import { useModalStore } from "../../../hooks/use-modal"
import { Modal } from "../modal";

type Schema = z.infer<typeof CategoryFormSchema>;

export const StoreModal = () => {
    const modal = useModalStore();

    const [error, SetError] = useState<string | undefined>('');
    const [success, SetSuccess] = useState<string | undefined>('');
    const [isPending, startTransition] = useTransition();

    const router = useRouter()

    const form = useForm<Schema>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (data: Schema) => {
        try {
            const response = await axios.post('/api/stores', data);
        } catch (error) {
            console.error(error);
        }

        return (
            <Modal isOpen={modal.isOpen} title="Modal" description="Holla new modal" onClose={modal.onClose} >
                <div>Modal Content</div>
                <div>
                    <div className="space-y-4 py-2 pb-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder='Category name' {...field} disabled={isPending} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-x-2 pt-6 flex items-center justify-end w-full ">
                                    <Button
                                        variant="outline"
                                        className="hover:cursor-pointer"
                                        onClick={modal.onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        disabled={isPending}
                                        type="submit"
                                        className="hover:cursor-pointer"
                                    >
                                        Create
                                    </Button>
                                    <ErrorToaster error={error} />
                                    <SuccessToaster success={success} />
                                </div>

                            </form>
                        </Form>
                    </div>
                </div>

            </Modal>
        )
    }