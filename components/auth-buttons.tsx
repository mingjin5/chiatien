"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { buttonClass } from "@/components/ui";

export function SignInButton({ callbackURL = "/" }: { callbackURL?: string }) {
  return (
    <button
      onClick={() =>
        authClient.signIn.social({ provider: "google", callbackURL })
      }
      className={buttonClass("primary", "md")}
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
      className={buttonClass("ghost", "sm")}
    >
      Đăng xuất
    </button>
  );
}
