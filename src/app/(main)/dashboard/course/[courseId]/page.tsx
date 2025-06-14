import { prisma } from "@/lib/prisma";
import React from "react";
import CourseDashboard from "@/components/CourseDashboard";
import FilePreviewDialog from "@/components/FilePreviewDialog";

export default async function CourseDashboardPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  //
  // Fetch root-level groups
  //
  const groups = await prisma.contantGroup.findMany({
    where: {
      courseId,
      parentGroupId: null,
    },
  });

  //
  // Fetch root-level materials
  //
  const materials = await prisma.material.findMany({
    where: {
      courseId,
      groupId: null,
    },
  });

  return <CourseDashboard groups={groups} materials={materials} />;
}
