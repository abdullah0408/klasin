"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Course } from "@/generated/prisma";
import { ScrollArea } from "./ui/scroll-area";
import { Sparkles, BookOpen, BookCopy } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCoursesUpdated?: () => void;
};

export default function CourseSelectionDialog({
  open,
  onOpenChange,
  onCoursesUpdated,
}: Props) {
  const { refreshSelectedCourses } = useNavigation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setLoadingCourses(true);
    Promise.all([
      fetch("/api/course").then((r) => r.json()) as Promise<Course[]>,
      fetch("/api/user/selected-courses").then((r) => r.json()) as Promise<{
        courseIds: string[];
      }>,
    ])
      .then(([allCourses, { courseIds }]) => {
        setCourses(allCourses);
        setSelectedIds(new Set(courseIds));
      })
      .catch(console.error)
      .finally(() => setLoadingCourses(false));
  }, [open]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/user/selected-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseIds: Array.from(selectedIds) }),
      });

      onCoursesUpdated?.();
      onOpenChange(false);
      refreshSelectedCourses();
    } catch (err) {
      console.error("Failed to save selected courses:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[600px] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4">
          <DialogTitle className="text-lg font-semibold">
            Select Your Courses
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 divide-y px-4 py-2">
          {loadingCourses ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center py-3 gap-4 animate-pulse"
              >
                <div className="h-4 w-4 rounded bg-muted" />
                <div className="w-20 h-4 rounded bg-muted" />
                <div className="flex-1 h-4 rounded bg-muted mx-4" />
              </div>
            ))
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-2">
              <BookCopy className="h-6 w-6" />
              <p className="text-sm">No courses available.</p>
            </div>
          ) : (
            courses.map((course) => {
              const isSelected = selectedIds.has(course.id);
              return (
                <label
                  key={course.id}
                  className="flex items-center justify-between gap-4 px-2 py-3 cursor-pointer transition hover:bg-accent rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelect(course.id)}
                    />
                    <span className="w-24 truncate font-mono text-xs text-muted-foreground">
                      {course.code}
                    </span>
                    <span className="truncate text-sm">{course.title}</span>
                  </div>
                </label>
              );
            })
          )}
        </ScrollArea>

        <DialogFooter>
          <div className="flex justify-between items-center w-full px-6 py-4 border-t">
            <div className="text-xs text-muted-foreground">
              {selectedIds.size === 0 ? (
                <span className="flex items-center gap-1">
                  <BookCopy className="h-4 w-4" />
                  Add your first course
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <BookCopy className="h-4 w-4" />
                  {selectedIds.size} course{selectedIds.size > 1 && "s"}{" "}
                  selected
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button onClick={save} disabled={saving || loadingCourses}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
