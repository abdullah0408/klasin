import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * GET /api/course/material/favorite
 *
 * This endpoint returns all favorite materials for the currently authenticated Clerk user.
 * It ensures the returned materials belong to courses the user is enrolled in.
 * Includes material ID, title, file URL, and the associated course title.
 *
 * Response codes:
 *   200 – OK, returns the list of favorite materials
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
    // Fetch all favorite materials where:
    // - The favorite is owned by the current user
    // - The associated material belongs to a course the user is enrolled in
    //
    const favoriteMaterials = await prisma.favoriteMaterial.findMany({
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
            course: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // Return the list of favorite materials
    return NextResponse.json(favoriteMaterials, { status: 200 });
  } catch (error) {
    // If anything goes wrong (e.g., database connectivity), log and return 500.
    console.error("Error fetching favorite materials: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
