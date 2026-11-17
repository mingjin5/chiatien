import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createGroup } from "@/app/actions/groups";
import { SignInButton } from "@/components/auth-buttons";
import { AppHeader } from "@/components/app-header";
import { ReceiptPreview } from "@/components/receipt-preview";
import {
  AvatarStack,
  Logo,
  PageSkeleton,
  buttonClass,
  givenName,
  inputClass,
} from "@/components/ui";

export default function Home() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const session = await getSession();
  if (!session) return <Landing />;

  const user = session.user;
  const groups = await prisma.group.findMany({
    where: { members: { some: { userId: user.id } } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      members: { select: { displayName: true }, orderBy: { createdAt: "asc" } },
    },
  });

  return (
    <>
      <AppHeader name={user.name || user.email} />
      <main className="mx-auto w-full max-w-xl px-5 pt-10 pb-16">
        <h1 className="font-display text-4xl leading-tight font-extrabold">
          Chào {givenName(user.name || user.email)}!
        </h1>
        <p className="mt-1 text-muted">
          Chọn một nhóm, hoặc tạo nhóm mới cho chuyến đi tiếp theo.
        </p>

        <form action={createGroup} className="mt-6 flex gap-2">
          <input
            name="name"
            required
            maxLength={60}
            aria-label="Tên nhóm"
            placeholder="Tên nhóm, ví dụ: Đà Lạt 2026"
            className={inputClass}
          />
          <button className={`${buttonClass("primary", "md")} shrink-0`}>
            Tạo nhóm
          </button>
        </form>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Nhóm của bạn</h2>
          {groups.length === 0 ? (
            <p className="mt-3 rounded-3xl bg-white p-6 text-muted">
              Chưa có nhóm nào. Đặt tên cho nhóm đầu tiên ở ô phía trên, ví dụ
              tên chuyến đi hoặc phòng trọ.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-12px_rgba(36,27,75,0.25)]">
              {groups.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/groups/${g.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-canvas"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold">{g.name}</p>
                      <p className="text-sm text-muted">
                        {g.members.length} thành viên
                      </p>
                    </div>
                    <AvatarStack names={g.members.map((m) => m.displayName)} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

function Landing() {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-5xl content-center gap-14 px-6 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
      <div>
        <Logo />
        <h1 className="mt-10 font-display text-5xl leading-[1.05] font-extrabold md:text-6xl">
          Đi chơi xong, không còn cãi nhau chuyện tiền.
        </h1>
        <p className="mt-5 max-w-md text-lg text-muted">
          Ghi khoản chi của cả nhóm. Chia Tiền tính ai nợ ai, gộp lại cho ít lần
          chuyển khoản nhất và tạo sẵn mã VietQR.
        </p>
        <div className="mt-8">
          <SignInButton />
        </div>
        <p className="mt-4 text-sm text-muted">
          Bạn bè chưa có tài khoản vẫn được thêm vào nhóm bằng tên.
        </p>
      </div>
      <ReceiptPreview />
    </main>
  );
}
