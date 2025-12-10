"use client";

import { useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation";

import { Billboard, Category, Role } from "@prisma/client";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Trash } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CategoryFormSchema } from "@/lib/schemas"
import axios from "axios";

interface CategoryFormProps {
    initialData: Category | null,
    billboards: Billboard[] | null,
}

type Schema = z.infer<typeof CategoryFormSchema>;

export const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter()
    const { storeId, categoryId } = useParams();

    const title = initialData ? "Edit Category" : "Create Category";
    const description = initialData ? "Edit your category details" : "Add a new category";
    const toastMessage = initialData ? "Category updated." : "Category created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<Schema>({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: '',
        }
    });

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${storeId}/categories/${categoryId}`)
            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/categories`);
            });
            toast("Category has been deleted", {
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
                await axios.patch(`/api/${storeId}/categories/${categoryId}`, data)
            } else {
                await axios.post(`/api/${storeId}/categories`, data)
            }

            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/categories`);
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
                        item="Category"
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
                            Delete Category
                        </Button>
                    </AlertModal >
                )}

            </div >
            <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => router.push(`/${storeId}/categories`)}
            >
                Return to Categories Page
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
                                        <Input placeholder='Category Name' {...field} disabled={loading || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billboard Id</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a Billboard Id" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />

                                            <SelectContent className="bg-white">
                                                {billboards?.map((billboard: Billboard) => (
                                                    <SelectItem key={billboard.id} value={billboard.id}>
                                                        {billboard.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
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