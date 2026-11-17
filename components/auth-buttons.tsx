"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignInButton({ callbackURL = "/" }: { callbackURL?: string }) {
  return (
    <button
      onClick={() =>
        authClient.signIn.social({ provider: "google", callbackURL })
      }
      className="rounded-lg bg-white px-6 py-3 text-black hover:opacity-80"
    >
      Đăng nhập với Google
    </button>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() =>
        authClient.signOut({
          fetchOptions: { onSuccess: () => router.refresh() },
        })
      }
      className="rounded-lg border px-6 py-3 hover:opacity-80"
    >
      Đăng xuất
    </button>
  );
}
