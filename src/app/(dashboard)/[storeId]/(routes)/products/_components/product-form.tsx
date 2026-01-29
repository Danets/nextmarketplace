"use client";

import { useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation";

import { Product, Image, Category, Size, Color } from "@prisma/client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox"
import { Trash } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ProductFormSchema } from "@/lib/schemas"
import axios from "axios";
import { ImageUpload } from "@/components/image-upload";

interface ProductFormProps {
    initialData: Product & { images: Image[] } | null,
    categories: Category[],
    sizes: Size[],
    colors: Color[],
}

type Schema = z.infer<typeof ProductFormSchema>;

export const ProductForm = ({ initialData, categories, sizes, colors }: ProductFormProps) => {
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const router = useRouter()
    const { storeId, productId } = useParams();

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit your product details" : "Add a new product";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save changes" : "Create";

    const form = useForm<Schema>({
        resolver: zodResolver(ProductFormSchema),
        defaultValues: initialData
            ? {
                ...initialData,
                price: parseFloat(String(initialData.price)),
            }
            : {
                name: '',
                images: [],
                price: 0,
                categoryId: '',
                sizeId: '',
                colorId: '',
                isFeatured: false,
                isArchived: false,
            }
    });

    const onHandleDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${storeId}/products/${productId}`)
            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/products`);
            });
            toast("Product has been deleted", {
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
                await axios.patch(`/api/${storeId}/products/${productId}`, data)
            } else {
                await axios.post(`/api/${storeId}/products`, data)
            }

            startTransition(() => {
                router.refresh();
                router.push(`/${storeId}/products`);
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
                        item="Product"
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
                            Delete Product
                        </Button>
                    </AlertModal >
                )}

            </div >
            <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
                onClick={() => router.push(`/${storeId}/products`)}
            >
                Return to Products Page
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
                                        <Input placeholder='Product Name' {...field} disabled={loading || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder='Product Price' {...field} disabled={loading || isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Id</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a Category Id" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />

                                            <SelectContent className="bg-white">
                                                {categories?.map((category: Category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size Id</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a Size Id" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />

                                            <SelectContent className="bg-white">
                                                {sizes?.map((size: Size) => (
                                                    <SelectItem key={size.id} value={size.id}>
                                                        {size.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color Id</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a Color Id" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <FormMessage />

                                            <SelectContent className="bg-white">
                                                {colors?.map((color: Color) => (
                                                    <SelectItem key={color.id} value={color.id}>
                                                        {color.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading || isPending}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Featured</FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading || isPending}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Archived</FormLabel>
                                        <FormDescription>
                                            This product will be archived
                                        </FormDescription>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="images"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image Url</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            onChange={(url) => field.onChange([...field.value, { url }])}
                                            onRemove={(url) => field.onChange([...field.value.filter((image) => image.url !== url)])}
                                            disabled={loading || isPending}
                                            value={field.value.length ? field.value.map((image) => image.url) : []}
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