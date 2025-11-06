"use client"

import { useTransition } from "react"
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

import { useModalStore } from "../../../hooks/use-modal"
import { Modal } from "../modal";
import { toast } from "sonner"

type Schema = z.infer<typeof CategoryFormSchema>;

export const StoreModal = () => {
    const modal = useModalStore();

    const [isPending, startTransition] = useTransition();

    const form = useForm<Schema>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = (data: Schema) => {
        startTransition(() => {
            axios.post('/api/stores', data)
                .then((response) => {
                    window.location.assign(`/${response.data.id}/settings`);
                    toast("Store has been created", {
                        action: {
                            label: "Close",
                            onClick: () => { },
                        },
                    })
                })
                .catch((err) => {
                    console.error(err);
                    toast(err.response.data, {
                        description: err.message,
                        action: {
                            label: "Close",
                            onClick: () => { },
                        },
                    })
                });
        })
    }

    return (
        <Modal
            isOpen={modal.isOpen}
            title="Create Store"
            description="Add a new store to manage products and categories"
            onClose={modal.onClose}
        >
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
                                            <Input placeholder='E-commerce' {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-x-2 pt-6 flex items-center justify-end w-full ">
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                    onClick={modal.onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={isPending}
                                    type="submit"
                                    className="cursor-pointer"
                                >
                                    Create
                                </Button>

                            </div>
                        </form>
                    </Form>
                </div>
            </div>

        </Modal>
    )
}