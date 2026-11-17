import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createGroup } from "@/app/actions/groups";
import { SignInButton, SignOutButton } from "@/components/auth-buttons";

async function UserSection() {
  const session = await getSession();
  if (!session) return <SignInButton />;

  const groups = await prisma.group.findMany({
    where: { members: { some: { userId: session.user.id } } },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
  });

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p>Xin chào, {session.user.name}</p>
        <SignOutButton />
      </div>

      <form action={createGroup} className="flex gap-2">
        <input
          name="name"
          required
          maxLength={60}
          placeholder="Tên nhóm, ví dụ: Đà Lạt 2026"
          className="flex-1 rounded-lg border bg-transparent px-4 py-3"
        />
        <button className="rounded-lg bg-white px-4 py-3 text-black hover:opacity-80">
          Tạo nhóm
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {groups.length === 0 && (
          <li className="opacity-60">Bạn chưa có nhóm nào.</li>
        )}
        {groups.map((g) => (
          <li key={g.id}>
            <Link
              href={`/groups/${g.id}`}
              className="block rounded-lg border px-4 py-3 hover:bg-white/10"
            >
              {g.name}
            </Link>
          </li>
        ))}
      </ul>
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
