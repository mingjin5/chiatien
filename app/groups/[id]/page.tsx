import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { addGuestMember } from "@/app/actions/groups";
import { AppHeader } from "@/components/app-header";
import { CopyButton } from "@/components/copy-button";
import {
  Avatar,
  AvatarStack,
  PageSkeleton,
  buttonClass,
  inputClass,
} from "@/components/ui";

export default function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
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
  const names = group.members.map((m) => m.displayName);

  return (
    <>
      <AppHeader name={user.name || user.email} />
      <main className="mx-auto w-full max-w-xl px-5 pt-8 pb-16">
        <Link
          href="/"
          className="text-sm font-medium text-muted hover:text-ink"
        >
          Tất cả nhóm
        </Link>
        <h1 className="mt-2 font-display text-4xl leading-tight font-extrabold">
          {group.name}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <AvatarStack names={names} max={5} />
          <span className="text-sm text-muted">
            {group.members.length} thành viên
          </span>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-[0_8px_30px_-12px_rgba(36,27,75,0.25)]">
          <h2 className="font-display text-2xl font-bold">Khoản chi</h2>
          <p className="mt-2 text-muted">
            Chưa có khoản chi nào. Thêm khoản đầu tiên để biết ai nợ ai.
          </p>
          <button disabled className={`${buttonClass("primary", "md")} mt-4`}>
            Thêm khoản chi (sắp có)
          </button>
        </section>

        <section className="mt-6 rounded-3xl bg-sun/25 p-6">
          <h2 className="font-display text-2xl font-bold">
            Mời bạn bè vào nhóm
          </h2>
          <p className="mt-1 text-sm text-ink/70">
            Gửi link này, ai bấm vào và đăng nhập sẽ vào được nhóm.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={inviteUrl}
              aria-label="Link mời"
              className={`${inputClass} text-sm`}
            />
            <CopyButton text={inviteUrl} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Thành viên</h2>
          <ul className="mt-3 divide-y divide-line">
            {group.members.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3">
                <Avatar name={m.displayName} size={44} />
                <span className="font-semibold">{m.displayName}</span>
                {!m.userId && (
                  <span className="rounded-full bg-line px-2.5 py-0.5 text-xs font-medium text-muted">
                    chưa có tài khoản
                  </span>
                )}
              </li>
            ))}
          </ul>

          <form
            action={addGuestMember.bind(null, group.id)}
            className="mt-4 flex gap-2"
          >
            <input
              name="displayName"
              required
              maxLength={40}
              aria-label="Tên thành viên"
              placeholder="Thêm bạn chưa có tài khoản, ví dụ: Nam"
              className={inputClass}
            />
            <button className={`${buttonClass("soft", "md")} shrink-0`}>
              Thêm
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
