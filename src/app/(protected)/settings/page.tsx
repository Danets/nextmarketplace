import { auth, signOut } from "../../../../auth";
import { Button } from "@/components/ui/button";


export default async function SettingsPage() {
  const session = await auth();
  return (<div>SettingsPage: {JSON.stringify(session)}
    <form action={async () => {
      "use server";
      await signOut({ redirectTo: "/sign-in" });
    }}>
      <Button type="submit">Sign Out</Button>
    </form>
  </div>);
}
