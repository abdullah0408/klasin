import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ courseIds: [] }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { courses: { select: { id: true } } },
  });

  const courseIds = user?.courses.map((c) => c.id) ?? [];

  return NextResponse.json({ courseIds });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseIds } = await req.json();

  if (!Array.isArray(courseIds)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.user.update({
    where: { clerkId: userId },
    data: {
      courses: {
        set: courseIds.map((id: string) => ({ id })),
      },
    },
  });

  return NextResponse.json({ success: true });
}
