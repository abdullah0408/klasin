"use client";

import { useState } from "react";
import FilePreviewDialog from "@/components/FilePreviewDialog";
import ItemCard from "@/components/ItemCard";
import { Course, Material } from "@/generated/prisma";

type Props = {
  selectedCourses: Course[];
  courses: Course[];
  materials: (Material & { course: Course })[];
  bookmarks: (Material & { course: { title: string } })[];
};

const RecentItems = ({
  selectedCourses,
  courses,
  materials,
  bookmarks,
}: Props) => {
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  return (
    <>
      <div className="p-6 space-y-6">
        {selectedCourses.length > 0 && (
          <>
            <h1 className="text-2xl font-bold">Selected Courses</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCourses.map((course) => (
                <ItemCard
                  key={course.id}
                  item={{ ...course, type: "Course" }}
                />
              ))}
            </div>
          </>
        )}

        <h1 className="text-2xl font-bold">Recently Viewed Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <ItemCard key={course.id} item={{ ...course, type: "Course" }} />
          ))}
        </div>

        <h1 className="text-2xl font-bold">Recently Viewed Materials</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <ItemCard
              key={material.id}
              item={{ ...material, type: "File" }}
              onPreview={(m: Material) => setPreviewMaterial(m)}
            />
          ))}
        </div>

        <h1 className="text-2xl font-bold">Bookmarked Materials</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((material) => (
            <ItemCard
              key={material.id}
              item={{ ...material, type: "File" }}
              onPreview={(m: Material) => setPreviewMaterial(m)}
            />
          ))}
        </div>
      </div>

      <FilePreviewDialog
        material={previewMaterial}
        open={!!previewMaterial}
        onOpenChange={(open) => !open && setPreviewMaterial(null)}
      />
    </>
  );
};

export default RecentItems;
