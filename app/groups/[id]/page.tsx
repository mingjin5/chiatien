import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { addGuestMember } from "@/app/actions/groups";
import { CopyButton } from "@/components/copy-button";

export default function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="p-6">Đang tải...</p>}>
      <GroupContent params={params} />
    </Suspense>
  );
}

async function GroupContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();

  // Chỉ thành viên của nhóm mới xem được
  const group = await prisma.group.findFirst({
    where: { id, members: { some: { userId: user.id } } },
    include: { members: { orderBy: { createdAt: "asc" } } },
  });
  if (!group) notFound();

  const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  const inviteUrl = `${baseUrl}/join/${group.inviteCode}`;

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-8 p-6">
      <Link href="/" className="text-sm opacity-70 hover:opacity-100">
        ← Về trang chủ
      </Link>
      <h1 className="text-2xl font-bold">{group.name}</h1>

      <section className="flex flex-col gap-2">
        <h2 className="font-semibold">Mời bạn bè</h2>
        <p className="text-sm opacity-70">
          Gửi link này, ai bấm vào và đăng nhập sẽ vào được nhóm.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={inviteUrl}
            className="flex-1 rounded-lg border bg-transparent px-4 py-3 text-sm"
          />
          <CopyButton text={inviteUrl} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-semibold">Thành viên ({group.members.length})</h2>
        <ul className="flex flex-col gap-2">
          {group.members.map((m) => (
            <li key={m.id} className="rounded-lg border px-4 py-3">
              {m.displayName}
              {!m.userId && (
                <span className="ml-2 text-sm opacity-60">
                  (chưa có tài khoản)
                </span>
              )}
            </li>
          ))}
        </ul>

        <form action={addGuestMember.bind(null, group.id)} className="flex gap-2">
          <input
            name="displayName"
            required
            maxLength={40}
            placeholder="Thêm bạn chưa có tài khoản, ví dụ: Nam"
            className="flex-1 rounded-lg border bg-transparent px-4 py-3"
          />
          <button className="rounded-lg bg-white px-4 py-3 text-black hover:opacity-80">
            Thêm
          </button>
        </form>
      </section>
    </main>
  );
}
