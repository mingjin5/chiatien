import { Suspense } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";

async function UserSection() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return <SignInButton />;

  return (
    <div className="flex flex-col items-center gap-4">
      <p>Xin chào, {session.user.name}</p>
      <SignOutButton />
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Chia Tiền</h1>
      <Suspense fallback={<p>Đang tải...</p>}>
        <UserSection />
      </Suspense>
    </main>
  );
}