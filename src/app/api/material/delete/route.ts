import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/material/delete
 *
 * This endpoint deletes a material.
 * It ensures that the user is authenticated and has admin privileges before allowing the deletion.
 * It expects the `materialId` to be passed as a query parameter, e.g.:
 *     /api/material/delete?materialId=abc123
 *
 * Response codes:
 *   200 – OK, material deleted successfully
 *   400 – Bad Request (missing or invalid materialId)
 *   401 – Unauthorized (no valid Clerk session)
 *   404 – Not Found (material does not exist)
 *   500 – Internal Server Error (unexpected exception)
 */
export async function DELETE(req: Request) {
  // Get the authenticated Clerk user ID from the session.
  const { userId } = await auth();

  // If the user is not authenticated, return 401 Unauthorized.
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Ensure the user exists and has admin privileges.
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
    // Check if the material exists before attempting to delete.
    //
    const existingMaterial = await prisma.material.findUnique({
      where: { id: materialId },
    });

    // If material not found, return 404 Not Found.
    if (!existingMaterial) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    //
    // Delete the material.
    //
    await prisma.material.delete({
      where: { id: materialId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log and return 500 on error (e.g., DB issue).
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
