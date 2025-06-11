import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/course/recent-unique-views
 *
 * This endpoint returns the 10 most recently *distinct* viewed courses for the authenticated user.
 * It uses a raw SQL query with `DISTINCT ON` to ensure only the latest view per course is returned,
 * ordered by `viewedAt` descending.
 *
 * Response codes:
 *   200 – OK, returns the list of recently viewed courses (deduplicated)
 *   401 – Unauthorized (no valid Clerk session)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function GET(req: Request) {
  // Retrieve the currently authenticated Clerk user ID.
  const { userId } = await auth();

  // If the user is not signed in, block access.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    //
    // Run a raw SQL query to get the most recent view per course.
    // It joins the CourseView and Course tables, filters by userId,
    // and limits the result to 10 unique courses.
    //
    const results = await prisma.$queryRawUnsafe(
      `
      SELECT DISTINCT ON ("courseId") 
        "CourseView".*, 
        "Course"."title", 
        "Course"."code"
      FROM "CourseView"
      JOIN "Course" ON "Course"."id" = "CourseView"."courseId"
      WHERE "CourseView"."userId" = $1
      ORDER BY "courseId", "viewedAt" DESC
      LIMIT 10;
    `,
      userId
    );

    // Return the deduplicated and most recent course views.
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    // If anything goes wrong (e.g., database connectivity), log and return 500.
    console.error("Error fetching recently viewed courses: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
