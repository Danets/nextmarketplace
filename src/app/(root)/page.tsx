import LoginButton from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-amber-500">
      <h1>Hello Admin!</h1>
      <p>Welcome to the admin dashboard.</p>
      <LoginButton>
        <Button variant="secondary" size="lg">
          Sign In
        </Button>
      </LoginButton>
    </main>
  );
}
