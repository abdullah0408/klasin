import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardItems from "@/components/DashboardItems";

const Page = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const recentCourseViews = await prisma.$queryRawUnsafe<
    { courseId: string; viewedAt: Date }[]
  >(
    `
    SELECT DISTINCT ON ("CourseView"."courseId")
      "CourseView"."courseId", "CourseView"."viewedAt"
    FROM "CourseView"
    WHERE "CourseView"."userId" = $1
    ORDER BY "CourseView"."courseId", "CourseView"."viewedAt" DESC
    `,
    userId
  );

  const courseIds = recentCourseViews.map((r) => r.courseId);
  const unorderedCourses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
  });

  const orderedCourses = courseIds
    .map((id) => {
      const course = unorderedCourses.find((c) => c.id === id);
      const viewedAt = recentCourseViews.find(
        (v) => v.courseId === id
      )?.viewedAt;
      return course
        ? { ...course, createdAt: viewedAt ?? course.createdAt }
        : null;
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by latest

  const recentMaterialViews = await prisma.$queryRawUnsafe<
    { materialId: string; viewedAt: Date }[]
  >(
    `
    SELECT DISTINCT ON ("MaterialView"."materialId")
      "MaterialView"."materialId", "MaterialView"."viewedAt"
    FROM "MaterialView"
    WHERE "MaterialView"."userId" = $1
    ORDER BY "MaterialView"."materialId", "MaterialView"."viewedAt" DESC
    LIMIT 10
    `,
    userId
  );

  const materialIds = recentMaterialViews.map((r) => r.materialId);
  const unorderedMaterials = await prisma.material.findMany({
    where: { id: { in: materialIds } },
    include: {
      course: true,
      ReadMaterial: {
        where: { userId },
        select: { userId: true },
      },
      // bookmarked: {
      //   where: { userId },
      //   select: { userId: true },
      // },
    },
  });

  const orderedMaterials = materialIds
    .map((id) => {
      const material = unorderedMaterials.find((m) => m.id === id);
      const viewedAt = recentMaterialViews.find(
        (v) => v.materialId === id
      )?.viewedAt;
      return material
        ? { ...material, createdAt: viewedAt ?? material.createdAt }
        : null;
    })
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by latest

  // const bookmarked = await prisma.bookmarkedMaterial.findMany({
  //   where: {
  //     userId,
  //     material: {
  //       course: {
  //         users: {
  //           some: {
  //             clerkId: userId,
  //           },
  //         },
  //       },
  //     },
  //   },
  //   select: {
  //     createdAt: true,
  //     material: {
  //       include: {
  //         course: true,
  //         ReadMaterial: {
  //           where: { userId },
  //           select: { userId: true },
  //         },
  //         bookmarked: {
  //           where: { userId },
  //           select: { userId: true },
  //         },
  //       },
  //     },
  //   },
  // });

  // const bookmarkedMaterials = bookmarked
  //   .map((b) => (b.material ? { ...b.material, createdAt: b.createdAt } : null))
  //   .filter((m): m is NonNullable<typeof m> => Boolean(m))
  //   .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by latest

  return (
    <DashboardItems
      courses={orderedCourses}
      materials={orderedMaterials}
      // bookmarks={bookmarkedMaterials}
    />
  );
};

export default Page;
