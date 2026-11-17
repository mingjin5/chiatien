"use server";

import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export async function createGroup(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name || name.length > 60) return;

  const group = await prisma.group.create({
    data: {
      name,
      createdById: user.id,
      members: {
        create: { userId: user.id, displayName: user.name || user.email },
      },
    },
  });
  redirect(`/groups/${group.id}`);
}

export async function joinGroup(code: string) {
  const user = await requireUser();
  const group = await prisma.group.findUnique({ where: { inviteCode: code } });
  if (!group) notFound();

  await prisma.member.upsert({
    where: { groupId_userId: { groupId: group.id, userId: user.id } },
    update: {},
    create: {
      groupId: group.id,
      userId: user.id,
      displayName: user.name || user.email,
    },
  });
  redirect(`/groups/${group.id}`);
}

export async function addGuestMember(groupId: string, formData: FormData) {
  const user = await requireUser();

  // Chỉ thành viên của nhóm mới được thêm người
  const isMember = await prisma.member.findFirst({
    where: { groupId, userId: user.id },
  });
  if (!isMember) notFound();

  const displayName = String(formData.get("displayName") ?? "").trim();
  if (!displayName || displayName.length > 40) return;

  await prisma.member.create({ data: { groupId, displayName } });
  revalidatePath(`/groups/${groupId}`);
}
