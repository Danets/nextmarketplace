"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { settings } from "@/app/actions/settings";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SettingsFormSchema } from "@/lib/schemas"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { ErrorToaster } from "@/components/error-toaster"
import { SuccessToaster } from "@/components/success-toaster"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Role } from "@prisma/client";

type Schema = z.infer<typeof SettingsFormSchema>;

export default function SettingsPage() {
  const { data, update } = useSession();

  const [error, SetError] = useState<string | undefined>('');
  const [success, SetSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<Schema>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      name: data?.user?.name || undefined,
      email: data?.user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role: data?.user?.role || undefined,
    },
  });

  useEffect(() => {
    update(); // Update session to get latest user data
  }, [])

  useEffect(() => {
    if (data?.user) {
      form.reset({
        name: data.user.name || undefined,
        email: data.user.email || undefined,
        password: undefined,
        newPassword: undefined,
        role: data?.user?.role || undefined,
      });
    }
  }, [data, form]);

  const onSubmit = (data: Schema) => {
    SetError("");
    SetSuccess("");
    startTransition(() => {
      settings(data)
        .then((response) => {
          if (response.error) {
            SetError(response.error);
          }
          if (response.success) {
            SetSuccess(response.success);
            update()
          }
        })
        .catch(() => {
          SetError("Something went wrong. Please try again.");
        });
    })
  }

  if (!data?.user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Settings session:
          <h3>Name: {data.user.name}</h3>
          <h3>Email: {data.user.email}</h3>
          <h3>Role: {data.user.role}</h3>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='username' {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!data.user.isOAuth && (
              <>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder='email' {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder='****' {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder='****' {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (

                  <FormItem>
                    <FormLabel>Role</FormLabel>

                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />

                      <SelectContent>
                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                        <SelectItem value={Role.USER}>User</SelectItem>
                      </SelectContent>
                    </Select>

                  </FormItem>
                )}
              />
            </div>

            <Button
              disabled={isPending}
              type="submit"
              className="w-full hover:cursor-pointer"
            >
              Update Info
            </Button>

            <ErrorToaster error={error} />
            <SuccessToaster success={success} />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}