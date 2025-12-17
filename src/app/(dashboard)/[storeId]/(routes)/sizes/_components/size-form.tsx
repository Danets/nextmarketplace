"use client";

import { useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation";

import { Size } from "@prisma/client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/alert-modal";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner"

import { Trash } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SizeFormSchema } from "@/lib/schemas"
import axios from "axios";

interface SizeFormProps {
    initialData: Size | null
}

type Schema = z.infer<typeof SizeFormSchema>;

export const SizeForm = ({ initialData }: SizeFormProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter()
    const { storeId, sizeId } = useParams();

    const title = initialData ? "Edit Size" : "Create Size";
    const description = initialData ? "Edit your size details" : "Add a new size";
    const toastMessage = initialData ? "Size updated." : "Size created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<Schema>({
        resolver: zodResolver(SizeFormSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${storeId}/sizes/${sizeId}`)
            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/sizes`);
            });
            toast("Size has been deleted", {
                action: {
                    label: "Close",
                    onClick: () => { },
                },
            })
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                toast(err.response?.data || 'An error occurred', {
                    description: err.message,
                    action: {
                        label: "Close",
                        onClick: () => { },
                    },
                })
            }
        }
        finally {
            setLoading(false);
        }
    }

    const onSubmit = async (data: Schema) => {
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data)
            } else {
                await axios.post(`/api/${storeId}/sizes`, data)
            }

            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/sizes`);
            });
            toast(toastMessage, {
                action: {
                    label: "Close",
                    onClick: () => { },
                },
            })
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                toast(err.response?.data || 'An error occurred', {
                    description: err.message,
                    action: {
                        label: "Close",
                        onClick: () => { },
                    },
                })
            }
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />

                {initialData && (
                    <AlertModal
                        item="Size"
                        action="delete"
                        handler={onHandleDelete}
                    >
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={loading || isPending}
                            className="cursor-pointer"
                        >
                            <Trash className="h-4 w-4" />
                            Delete Size
                        </Button>
                    </AlertModal >
                )}

            </div >
            <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => router.push(`/${storeId}/sizes`)}
            >
                Return to Sizes Page
            </Button>
            <Separator className="my-4" />
            {(loading || isPending) && <Spinner />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Size Name' {...field} disabled={loading || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Size Value' {...field} disabled={loading || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        disabled={loading || isPending}
                        type="submit"
                        className="hover:cursor-pointer"
                    >
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}