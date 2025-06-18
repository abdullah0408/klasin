import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/group/delete
 *
 * This endpoint deletes a content group (ContantGroup), including all associated materials.
 * It ensures that the user is authenticated and has admin privileges before allowing the deletion.
 * It expects the `groupId` to be passed as a query parameter, e.g.:
 *     /api/group/delete?groupId=abc123
 *
 * Response codes:
 *   200 – OK, group deleted successfully
 *   400 – Bad Request (missing or invalid groupId)
 *   401 – Unauthorized (no valid Clerk session)
 *   404 – Not Found (group does not exist)
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

  // Extract groupId from the query string (?groupId=xyz)
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  // If groupId is not provided, return 400 Bad Request.
  if (!groupId) {
    return NextResponse.json({ error: "Missing groupId" }, { status: 400 });
  }

  try {
    //
    // Check if the group exists before attempting to delete.
    //
    const existingGroup = await prisma.contantGroup.findUnique({
      where: { id: groupId },
    });

    // If group not found, return 404 Not Found.
    if (!existingGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    //
    // Delete the group.
    //
    await prisma.contantGroup.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log and return 500 on error (e.g., DB issue).
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
