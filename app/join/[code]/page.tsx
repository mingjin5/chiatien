import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { joinGroup } from "@/app/actions/groups";
import { SignInButton } from "@/components/auth-buttons";

export default function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense fallback={<p className="p-6">Đang tải...</p>}>
      <JoinContent params={params} />
    </Suspense>
  );
}

async function JoinContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const group = await prisma.group.findUnique({
    where: { inviteCode: code },
    select: { id: true, name: true },
  });
  if (!group) notFound();

  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <p className="opacity-70">Bạn được mời vào nhóm</p>
      <h1 className="text-3xl font-bold">{group.name}</h1>
      {!session ? (
        <SignInButton callbackURL={`/join/${code}`} />
      ) : (
        <JoinForm code={code} groupId={group.id} userId={session.user.id} />
      )}
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
      <button className="rounded-lg bg-white px-6 py-3 text-black hover:opacity-80">
        Tham gia nhóm
      </button>
    </form>
  );
}
