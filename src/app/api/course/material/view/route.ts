import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/material/view
 *
 * This endpoint tracks a material view for the currently authenticated Clerk user.
 * It expects the `materialId` to be passed as a query parameter, e.g.:
 *     /api/material/view?materialId=abc123
 *
 * Response codes:
 *   200 – OK, view recorded successfully
 *   400 – Bad Request (missing materialId)
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

  // Extract materialId from the query string (?materialId=xyz)
  const { searchParams } = new URL(req.url);
  const materialId = searchParams.get("materialId");

  // If materialId is not provided, return 400 Bad Request.
  if (!materialId) {
    return NextResponse.json({ error: "Missing materialId" }, { status: 400 });
  }

  try {
    //
    // Create a new MaterialView record associated with the user and material.
    //
    await prisma.materialView.create({
      data: {
        userId,
        materialId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log and return 500 on error (e.g., invalid materialId, DB issue).
    console.error("Error recording material view: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
