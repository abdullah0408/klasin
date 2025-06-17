import { prisma } from "@/lib/prisma";
import React from "react";
import CourseDashboard from "@/components/CourseDashboard";

export default async function CourseDashboardPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  //
  // Check if course exists
  //
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h1 className="text-3xl font-bold mb-2">Course Not Found</h1>
        <p className="text-gray-600">
          The course you are looking for does not exist.
        </p>
      </div>
    );
  }

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
