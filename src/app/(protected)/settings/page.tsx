"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function SettingsPage() {
  const { data, status, update } = useSession();

  useEffect(() => {
    update(); // Update session to get latest user data
  }, [])

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // if (!data?.user) {
  //   return <div>Not authorized</div>;
  // }

  return (
    <div>
      <h3>SettingsPage</h3>
      {/* <Button onClick={() => signOut()} type="submit">Sign Out</Button> */}
    </div>
  );
}