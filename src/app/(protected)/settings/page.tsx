"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "../../../../hooks/use-current-user";


export default function SettingsPage() {

  const user = useCurrentUser();

  const onClick = () => {
    signOut();
  }
  return <div>SettingsPage: {JSON.stringify(user)}
    <Button onClick={onClick} type="submit">Sign Out</Button>
  </div>;
}
