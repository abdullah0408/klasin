import { prisma } from "@/lib/prisma";
import ItemCard from "@/components/ItemCard";
import React from "react";
import CourseDashboard from "@/components/CourseDashboard";

export default async function CourseDashboardPage({
  params,
}: {
  params: Promise<{ courseId: string; groupId: string }>;
}) {
  const { courseId, groupId } = await params;

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
  });

  return <CourseDashboard groups={groups} materials={materials} />;
}
