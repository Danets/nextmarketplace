"use client";

import { useSession } from "next-auth/react";
import { useEffect, useTransition } from "react";
import { settings } from "@/app/actions/settings";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { data, update } = useSession();

  useEffect(() => {
    update(); // Update session to get latest user data
  }, [])

  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      settings({ name: "Bob Marly" }).then(() => update());
    });
  }

  if (!data?.user) {
    return <div>Not authorized</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Settings session:
          <h3>Name: {data.user.name}</h3>
          <h3>Email: {data.user.email}</h3>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button disabled={isPending} onClick={onClick}>Upate Name</Button>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}