"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import NavUser from "./NavUser";
import { useNavigation } from "@/hooks/useNavigation";
import CourseSelectionDialog from "./CourseSelectionDialog";
import { Pencil, Plus } from "lucide-react";

const SidebarLeft = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    selectedCourses,
    selectedCourseIsLoading,
    bookmarkedMaterials,
    isBookmarkedMaterialsLoading,
  } = useNavigation();

  return (
    <>
      <Sidebar variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="flex items-center justify-center hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-pointer"
                asChild
              >
                <Link
                  href="/dashboard"
                  className="block max-h-12 overflow-hidden hover:bg-transparent focus:bg-transparent active:bg-transparent cursor-pointer"
                >
                  <Image
                    src="/logo.jpg"
                    alt="Zhi Logo"
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Selected Courses</SidebarGroupLabel>
            <SidebarMenu>
              {selectedCourseIsLoading ? (
                <div>
                  {[...Array(3)].map((_, i) => (
                    <SidebarMenuSkeleton key={i} />
                  ))}
                </div>
              ) : selectedCourses.length === 0 ? (
                <div className="flex items-center justify-center h-12 text-muted-foreground">
                  <span>No courses selected</span>
                </div>
              ) : (
                <>
                  {selectedCourses.map((course) => (
                    <SidebarMenuItem key={course.id}>
                      <SidebarMenuButton asChild>
                        <Link href={`/dashboard/course/${course.id}`}>
                          <span>{course.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setDialogOpen(true)}
                      className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-primary-foreground hover:underline hover:text-primary/80"
                    >
                      {selectedCourses.length === 0 ? (
                        <>
                          <Plus className="w-4 h-4" />
                          Add your first course
                        </>
                      ) : (
                        <>
                          <Pencil className="w-4 h-4" />
                          Edit selected courses
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Bookmarked Documents</SidebarGroupLabel>
            <SidebarMenu>
              {isBookmarkedMaterialsLoading ? (
                <div>
                  {[...Array(2)].map((_, i) => (
                    <SidebarMenuSkeleton key={i} />
                  ))}
                </div>
              ) : bookmarkedMaterials.length === 0 ? (
                <div className="flex items-center justify-center h-12 text-muted-foreground">
                  <span>No matches</span>
                </div>
              ) : (
                bookmarkedMaterials.map((material) => (
                  <SidebarMenuItem key={material.materialId}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton asChild>
                          <Link
                            href={`/dashboard/course/${material.material.courseId}/material/${material.materialId}`}
                            className="w-full flex justify-between items-center gap-2"
                          >
                            <span className="truncate text-foreground font-medium">
                              {material.material.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-xs text-white">
                          {material.material.course.title}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <CourseSelectionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
};

export default SidebarLeft;
