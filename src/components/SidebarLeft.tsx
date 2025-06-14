"use client";

import React from "react";
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
import Link from "next/link";
import Image from "next/image";
import NavUser from "./NavUser";
import { useNavigation } from "@/hooks/useNavigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const SidebarLeft = () => {
  const {
    selectedCourses,
    selectedCourseIsLoading,
    favoriteMaterials,
    isFavoriteMaterialsLoading,
  } = useNavigation();
  return (
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
              selectedCourses.map((course) => (
                <SidebarMenuItem key={course.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/dashboard/course/${course.id}`}>
                      <span>{course.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Favorite Documents</SidebarGroupLabel>
          <SidebarMenu>
            {isFavoriteMaterialsLoading ? (
              <div>
                {[...Array(2)].map((_, i) => (
                  <SidebarMenuSkeleton key={i} />
                ))}
              </div>
            ) : favoriteMaterials.length === 0 ? (
              <div className="flex items-center justify-center h-12 text-muted-foreground">
                <span>No matches</span>
              </div>
            ) : (
              favoriteMaterials.map((material) => (
                <SidebarMenuItem key={material.materialId}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/dashboard/course/${material.materialId}`}
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
  );
};

export default SidebarLeft;
