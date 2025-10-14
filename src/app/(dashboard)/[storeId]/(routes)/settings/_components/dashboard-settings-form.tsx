"use client";

import { useState, useTransition } from "react"

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
import { ErrorToaster } from "@/components/error-toaster"
import { SuccessToaster } from "@/components/success-toaster"

import { Trash } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DashboardSettingsFormSchema } from "@/lib/schemas"
import axios from "axios";
import { toast } from "sonner"
import { useModalStore } from "../../../../../../../hooks/use-modal";
import { useParams, useRouter } from "next/navigation";

interface DashboardSettingsFormProps {
    initialData: Store
}

type Schema = z.infer<typeof DashboardSettingsFormSchema>;

export const DashboardSettingsForm = ({ initialData }: DashboardSettingsFormProps) => {
    const [error, SetError] = useState<string | undefined>('');
    const [success, SetSuccess] = useState<string | undefined>('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const modal = useModalStore();

    const router = useRouter()
    const { storeId } = useParams();

    const form = useForm<Schema>({
        resolver: zodResolver(DashboardSettingsFormSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data: Schema) => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/stores/${storeId}`, data)
            router.refresh();
            SetSuccess(response.statusText);
            toast(response.statusText, {
                description: response.data.updatedAt,
                action: {
                    label: "Close",
                    onClick: () => modal.onClose(),
                },
            })
        } catch (err) {
            console.error(err);
            if (axios.isAxiosError(err)) {
                toast(err.response?.data || 'An error occurred', {
                    description: err.message,
                    action: {
                        label: "Close",
                        onClick: () => modal.onClose(),
                    },
                })
                SetError(err.response?.data);
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
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => { }}
                >
                    <Trash className="h-4 w-4" />
                    Delete Store
                </Button>
            </div>
            <Separator className="my-4" />
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
                                        <Input placeholder='Store name' {...field} disabled={loading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        disabled={loading}
                        type="submit"
                        className="hover:cursor-pointer"
                    >
                        Save Changes
                    </Button>
                    <ErrorToaster error={error} />
                    <SuccessToaster success={success} />
                </form>
            </Form>
        </>
    )
}