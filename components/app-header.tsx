import Link from "next/link";
import { Avatar, Logo } from "@/components/ui";
import { SignOutButton } from "@/components/auth-buttons";

export function AppHeader({ name }: { name: string }) {
  return (
    <header className="mx-auto flex w-full max-w-xl items-center justify-between px-5 pt-5">
      <Link href="/" aria-label="Về trang chủ">
        <Logo size={28} />
      </Link>
      <div className="flex items-center gap-1">
        <Avatar name={name} size={36} />
        <SignOutButton />
      </div>
    </header>
  );
}
