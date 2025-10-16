"use client";

import { useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation";

import { Store } from "@prisma/client";

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
import { DashboardSettingsFormSchema } from "@/lib/schemas"
import axios from "axios";

interface DashboardSettingsFormProps {
    initialData: Store
}

type Schema = z.infer<typeof DashboardSettingsFormSchema>;

export const DashboardSettingsForm = ({ initialData }: DashboardSettingsFormProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter()
    const { storeId } = useParams();

    const form = useForm<Schema>({
        resolver: zodResolver(DashboardSettingsFormSchema),
        defaultValues: initialData
    });

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/stores/${storeId}`)
            startTransition(() => {
                router.refresh();
                router.push("/");
            });
            toast("Store has been deleted", {
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
            await axios.patch(`/api/stores/${storeId}`, data)
            startTransition(() => {
                router.refresh();
            });
            toast("Store has been updated", {
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
                <Heading title="Settings" description="Manage store preferences" />
                <AlertModal
                    item="Store"
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
                        Delete Store
                    </Button>
                </AlertModal >
            </div >
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
                                        <Input placeholder='Store name' {...field} disabled={loading || isPending} />
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
                        Save Changes
                    </Button>
                </form>
            </Form>
        </>
    )
}