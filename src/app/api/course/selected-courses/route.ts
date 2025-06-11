import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/course/selected-courses
 *
 * This endpoint returns the list of selected courses for the currently authenticated Clerk user.
 * It uses Clerk’s `auth()` function to verify the session and extract the user’s Clerk ID.
 *
 * Response codes:
 *   200 – OK, returns the list of selected courses
 *   401 – Unauthorized (no valid Clerk session)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function GET(req: Request) {
  // Get the authenticated Clerk user ID from the session.
  const { userId } = await auth();

  // If the user is not authenticated, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    //
    // Query the User row matching the Clerk ID and include their selected courses.
    //
    const selectedCourses = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        courses: true,
      },
    });

    // Return the selected courses (or empty array if not found).
    return NextResponse.json(selectedCourses?.courses ?? [], { status: 200 });
  } catch (error) {
    // If anything goes wrong (e.g., database connectivity), log and return 500.
    console.error("Error fetching selectedCourses: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
