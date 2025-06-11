import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/course/view
 *
 * This endpoint tracks a course view for the currently authenticated Clerk user.
 * It expects the `courseId` to be passed as a query parameter, e.g.:
 *     /api/course/view?courseId=abc123
 *
 * Response codes:
 *   200 – OK, view recorded successfully
 *   400 – Bad Request (missing courseId)
 *   401 – Unauthorized (no valid Clerk session)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function POST(req: Request) {
  // Get the authenticated Clerk user ID from the session.
  const { userId } = await auth();

  // If the user is not authenticated, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Extract courseId from the query string (?courseId=xyz)
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  // If courseId is not provided, return 400 Bad Request.
  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  try {
    //
    // Create a new CourseView record associated with the user and course.
    //
    await prisma.courseView.create({
      data: {
        userId,
        courseId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log and return 500 on error (e.g., invalid courseId, DB issue).
    console.error("Error recording course view: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
