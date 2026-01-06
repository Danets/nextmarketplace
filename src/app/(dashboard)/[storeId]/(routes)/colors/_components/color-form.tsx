"use client";

import { useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation";

import { Color } from "@prisma/client";

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
import { ColorFormSchema } from "@/lib/schemas"
import axios from "axios";

interface ColorFormProps {
    initialData: Color | null
}

type Schema = z.infer<typeof ColorFormSchema>;

export const ColorForm = ({ initialData }: ColorFormProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter()
    const { storeId, colorId } = useParams();

    const title = initialData ? "Edit Color" : "Create Color";
    const description = initialData ? "Edit your color details" : "Add a new color";
    const toastMessage = initialData ? "Color updated." : "Color created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<Schema>({
        resolver: zodResolver(ColorFormSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${storeId}/colors/${colorId}`)
            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/colors`);
            });
            toast("Color has been deleted", {
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
                await axios.patch(`/api/${storeId}/colors/${colorId}`, data)
            } else {
                await axios.post(`/api/${storeId}/colors`, data)
            }

            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/colors`);
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
                        item="Color"
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
                            Delete Color
                        </Button>
                    </AlertModal >
                )}

            </div >
            <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => router.push(`/${storeId}/colors`)}
            >
                Return to Colors Page
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
                                        <Input placeholder='Color Name' {...field} disabled={loading || isPending} />
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
                                        <div className="flex items-center gap-x-4">
                                            <Input placeholder='Color Value' {...field} disabled={loading || isPending} />
                                            <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: field.value }} />
                                        </div>
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