import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId")?.trim();
  if (!courseId)
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });

  // All groups with their materials
  const groups = await prisma.contantGroup.findMany({
    where: { courseId },
    include: { materials: true },
  });

  // All materials not in any group
  const rootMaterials = await prisma.material.findMany({
    where: { courseId, groupId: null },
  });

  return NextResponse.json({ groups, rootMaterials }, { status: 200 });
}
