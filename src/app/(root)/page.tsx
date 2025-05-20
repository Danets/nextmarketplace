import {
  SignedIn,
  UserButton,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <>
      <h1>Hello Admin!</h1>
      <p>Welcome to the admin dashboard.</p>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
