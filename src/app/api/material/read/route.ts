import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * POST /api/material/read
 *
 * This endpoint allows a signed-in user to mark a material as read or unread.
 * It expects a JSON body with:
 *   - `materialId` (string)
 *   - `isRead` (boolean)
 *
 * If `isRead` is true, it creates a read marker in the database.
 * If false, it removes the existing marker for the material (if any).
 *
 * Response codes:
 *   200 – OK, read status updated
 *   400 – Bad Request (missing or invalid input)
 *   401 – Unauthorized (no valid Clerk session)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function POST(req: Request) {
  // Get authenticated user ID
  const { userId } = await auth();

  // Reject unauthenticated access
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { materialId, isRead } = body;

    // Validate input types
    if (!materialId || typeof isRead !== "boolean") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    if (isRead) {
      //
      // Mark as read
      //
      await prisma.readMaterial.create({
        data: {
          materialId,
          userId,
        },
      });
    } else {
      //
      // Remove read status
      //
      await prisma.readMaterial.deleteMany({
        where: {
          materialId,
          userId,
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error updating read material status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
