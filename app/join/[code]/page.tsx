import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { joinGroup } from "@/app/actions/groups";
import { SignInButton } from "@/components/auth-buttons";
import {
  AvatarStack,
  Logo,
  PageSkeleton,
  buttonClass,
} from "@/components/ui";

export default function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <JoinContent params={params} />
    </Suspense>
  );
}

async function JoinContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const group = await prisma.group.findUnique({
    where: { inviteCode: code },
    select: {
      id: true,
      name: true,
      members: { select: { displayName: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!group) notFound();

  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-10">
      <Logo />
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-[0_24px_50px_-20px_rgba(36,27,75,0.35)]">
        <p className="text-muted">Bạn được mời vào nhóm</p>
        <h1 className="font-display text-4xl leading-tight font-extrabold">
          {group.name}
        </h1>
        <AvatarStack
          names={group.members.map((m) => m.displayName)}
          size={40}
        />
        <p className="text-sm text-muted">
          {group.members.length} thành viên đang ở trong nhóm
        </p>
        <div className="mt-2">
          {!session ? (
            <SignInButton callbackURL={`/join/${code}`} />
          ) : (
            <JoinForm code={code} groupId={group.id} userId={session.user.id} />
          )}
        </div>
      </div>
    </main>
  );
}

async function JoinForm({
  code,
  groupId,
  userId,
}: {
  code: string;
  groupId: string;
  userId: string;
}) {
  const existing = await prisma.member.findFirst({ where: { groupId, userId } });
  if (existing) redirect(`/groups/${groupId}`);

  return (
    <form action={joinGroup.bind(null, code)}>
      <button className={buttonClass("primary", "md")}>Tham gia nhóm</button>
    </form>
  );
}
