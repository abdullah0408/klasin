import { prisma } from "@/lib/prisma";
import React from "react";
import CourseDashboard from "@/components/CourseDashboard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CourseDashboardPage({
  params,
}: {
  params: Promise<{ courseId: string; groupId: string }>;
}) {
  const { courseId, groupId } = await params;
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }
  //
  // Fetch root-level groups
  //
  const groups = await prisma.contantGroup.findMany({
    where: {
      courseId,
      parentGroupId: groupId,
    },
  });

  //
  // Fetch root-level materials
  //
  const materials = await prisma.material.findMany({
    where: {
      courseId,
      groupId,
    },
    include: {
      ReadMaterial: {
        where: { userId },
        select: { userId: true },
      },
      // bookmarked: {
      //   where: { userId },
      //   select: { userId: true },
      // }
    },
  });

  return <CourseDashboard groups={groups} materials={materials} />;
}
