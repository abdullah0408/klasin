"use client";

import { useState } from "react";
import FilePreviewDialog from "@/components/FilePreviewDialog";
import ItemCard from "@/components/ItemCard";
import { Course, Material } from "@/generated/prisma";
import { useNavigation } from "@/hooks/useNavigation";
import { Card, CardContent } from "./ui/card";
import { Plus } from "lucide-react";
import CourseSelectionDialog from "./CourseSelectionDialog";

type Props = {
  courses: Course[];
  materials: (Material & { course: Course })[];
  bookmarks: (Material & { course: { title: string } })[];
};

const DashboardItems = ({ courses, materials, bookmarks }: Props) => {
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const { selectedCourses, selectedCourseIsLoading, refreshSelectedCourses } =
    useNavigation();
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log("Selected Courses:", selectedCourses);
  return (
    <>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Selected Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedCourses.map((course) => (
            <ItemCard key={course.id} item={{ ...course, type: "Course" }} />
          ))}

          <Card
            onClick={() => setDialogOpen(true)}
            className="box-border hover:shadow-md flex items-center justify-center transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-dotted border-border/50 relative py-0"
          >
            <CardContent className="box-border flex items-center justify-center p-4 space-x-3">
              <div className="text-muted-foreground">
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {!!selectedCourses.length
                    ? "Manage selected courses"
                    : "Select your first course"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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
      <CourseSelectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default DashboardItems;
