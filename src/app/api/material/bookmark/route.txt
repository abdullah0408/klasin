// import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// /**
//  * POST /api/material/bookmark
//  *
//  * This endpoint allows a signed-in user to either add or remove a bookmark for a given material.
//  * It expects a JSON body with `materialId` (string) and `isRead` (boolean).
//  * If `isRead` is true, it creates a bookmark entry. If false, it removes the existing one (if any).
//  *
//  * Response codes:
//  *   200 – OK, bookmark created or removed successfully
//  *   400 – Bad Request (missing or invalid input)
//  *   401 – Unauthorized (no valid Clerk session)
//  *   500 – Internal Server Error (unexpected exception)
//  */
// export async function POST(req: Request) {
//   // Get user authentication from Clerk
//   const { userId } = await auth();

//   // Reject if no user is authenticated
//   if (!userId) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await req.json();
//     const { materialId, isRead } = body;

//     // Validate required fields
//     if (!materialId || typeof isRead !== "boolean") {
//       return NextResponse.json({ error: "Invalid input" }, { status: 400 });
//     }

//     if (isRead) {
//       //
//       // Add bookmark
//       //
//       await prisma.bookmarkedMaterial.create({
//         data: {
//           materialId,
//           userId,
//         },
//       });
//     } else {
//       //
//       // Remove existing bookmark
//       //
//       await prisma.bookmarkedMaterial.deleteMany({
//         where: {
//           materialId,
//           userId,
//         },
//       });
//     }

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error("Error handling bookmark operation:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
