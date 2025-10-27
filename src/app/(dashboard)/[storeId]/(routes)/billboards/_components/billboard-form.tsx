"use client";

import { useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation";

import { Billboard } from "@prisma/client";

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
import { BillboardFormSchema } from "@/lib/schemas"
import axios from "axios";
import { ImageUpload } from "@/components/image-upload";

interface BillboardFormProps {
    initialData: Billboard | null
}

type Schema = z.infer<typeof BillboardFormSchema>;

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter()
    const { storeId, billboardId } = useParams();

    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const description = initialData ? "Edit your billboard details" : "Add a new billboard";
    const toastMessage = initialData ? "Billboard updated." : "Billboard created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<Schema>({
        resolver: zodResolver(BillboardFormSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    });

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${storeId}/billboards${billboardId}`)
            startTransition(() => {
                router.refresh();
                router.push("/");
            });
            toast("Billboard has been deleted", {
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
                await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data)
            } else {
                await axios.post(`/api/${storeId}/billboards`, data)
            }

            startTransition(() => {
                router.refresh();
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
                        item="Billboard"
                        action="delete"
                        handler={onHandleDelete}
                    >
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={loading || isPending}
                            onClick={() => { }}
                            className="hover:cursor-pointer"
                        >
                            <Trash className="h-4 w-4" />
                            Delete Billboard
                        </Button>
                    </AlertModal >
                )}

            </div >
            <Separator className="my-4" />
            {(loading || isPending) && <Spinner />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Billboard Label' {...field} disabled={loading || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image Url</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            onChange={(url) => field.onChange(url)}
                                            onRemove={() => field.onChange("")}
                                            disabled={loading || isPending}
                                            value={field.value ? [field.value] : []}
                                        />
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