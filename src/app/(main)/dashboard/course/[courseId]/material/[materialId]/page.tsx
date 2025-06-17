import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import ReadSwitch from "@/components/ReadSwitch";
import { Download } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string, materialId: string }>;
}) {
  const { courseId, materialId } = await params;
  const currentMaterial = await prisma.material.findUnique({
    where: { id: materialId },
    select: {
      id: true,
      fileUrl: true,
      createdAt: true,
      groupId: true,
      title: true,
    },
  });

  if (!currentMaterial) {
    return <p className="text-sm text-center py-4">Material not found</p>;
  }

  const { groupId, createdAt, fileUrl, title } = currentMaterial;
  const [previous, next] = await Promise.all([
    prisma.material.findFirst({
      where: { courseId, groupId, createdAt: { lt: createdAt } },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true },
    }),
    prisma.material.findFirst({
      where: { courseId, groupId, createdAt: { gt: createdAt } },
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true },
    }),
  ]);

  const viewerUrl = fileUrl
    ? `https://docs.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_R2_Public_URL}/${fileUrl}`
      )}`
    : null;

  return (
    <div className="relative w-full flex flex-col h-[calc(100vh-3rem)]">
      {viewerUrl ? (
        <iframe
          src={viewerUrl}
          className="flex-1 w-full border-none"
          title={title}
        />
      ) : (
        <p className="text-sm text-center py-4 text-muted-foreground">
          No preview available
        </p>
      )}

      <div className="flex justify-between mt-2 px-2 bg-background rounded-md shadow-sm">
        {previous ? (
          <Button
            asChild
            variant="outline"
            className="max-w-[45%] truncate justify-start"
          >
            <Link
              href={`/dashboard/course/${courseId}/material/${previous.id}`}
            >
              ← Previous: {previous.title}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled className="invisible" />
        )}
        {next ? (
          <Button
            asChild
            variant="outline"
            className="max-w-[45%] truncate text-right justify-start"
          >
            <Link href={`/dashboard/course/${courseId}/material/${next.id}`}>
              Next: {next.title} →
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled className="invisible" />
        )}
      </div>

      <div className="mt-4 px-2 bg-background rounded-md shadow-sm flex items-center gap-2 justify-start">
        {fileUrl ? (
          <Button
            asChild
            variant="default"
            aria-label={`Download ${title}`}
            className="gap-2"
          >
            <a
              href={`${process.env.NEXT_PUBLIC_R2_Public_URL}/${fileUrl}`}
              download
            >
              <Download className="w-4 h-4" />
              Download
            </a>
          </Button>
        ) : (
          <Button variant="secondary" disabled>
            Download
          </Button>
        )}
        <ReadSwitch />
      </div>
    </div>
  );
}
