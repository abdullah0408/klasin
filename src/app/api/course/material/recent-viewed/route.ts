import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/material/recent-unique-views
 *
 * This endpoint returns the 10 most recently *distinct* viewed materials for the authenticated user.
 * It uses a raw SQL query with `DISTINCT ON` to ensure only the latest view per material is returned,
 * and also includes associated course titles and material metadata.
 *
 * Response codes:
 *   200 – OK, returns the list of recently viewed materials (deduplicated)
 *   401 – Unauthorized (no valid Clerk session)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function GET(req: Request) {
  // Retrieve the currently authenticated Clerk user ID.
  const { userId } = await auth();

  // If the user is not signed in, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    //
    // Run a raw SQL query to get the most recent view per material.
    // It joins MaterialView, Material, and Course tables,
    // includes material and course titles, and limits the result to 10.
    //
    const results = await prisma.$queryRawUnsafe(
      `
      SELECT DISTINCT ON ("MaterialView"."materialId")
        "MaterialView".*,
        "Material"."title" AS "materialTitle",
        "Material"."fileUrl",
        "Material"."courseId",
        "Course"."title" AS "courseTitle"
      FROM "MaterialView"
      JOIN "Material" ON "Material"."id" = "MaterialView"."materialId"
      JOIN "Course" ON "Course"."id" = "Material"."courseId"
      WHERE "MaterialView"."userId" = $1
      ORDER BY "MaterialView"."materialId", "MaterialView"."viewedAt" DESC
      LIMIT 10;
    `,
      userId
    );

    // Return the deduplicated, most recent material views with metadata.
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    // If anything goes wrong (e.g., database connectivity), log and return 500.
    console.error("Error fetching recently viewed materials: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
