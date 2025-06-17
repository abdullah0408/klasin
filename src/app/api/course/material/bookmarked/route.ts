import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/course/material/bookmarked
 *
 * This endpoint returns up to 10 bookmarked materials for the currently authenticated Clerk user.
 * It ensures the returned materials belong to courses the user is enrolled in.
 * Includes material ID, title, file URL, and the associated course title.
 *
 * Response codes:
 *   200 – OK, returns the list of bookmarked materials
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
    // Fetch up to 10 bookmarked materials where:
    // - The bookmark is owned by the current user
    // - The associated material belongs to a course the user is enrolled in
    //
    const bookmarkedMaterial = await prisma.bookmarkedMaterial.findMany({
      take: 10, // Limit the results to 10 bookmarked materials
      where: {
        userId: userId,
        material: {
          course: {
            users: {
              some: {
                clerkId: userId,
              },
            },
          },
        },
      },
      select: {
        materialId: true,
        material: {
          select: {
            id: true,
            title: true,
            fileUrl: true,
            courseId: true,
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // Return the list of bookmarked materials
    return NextResponse.json(bookmarkedMaterial, { status: 200 });
  } catch (error) {
    // If anything goes wrong (e.g., database connectivity), log and return 500.
    console.error("Error fetching bookmarked materials: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
