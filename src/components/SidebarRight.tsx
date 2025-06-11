"use client";

import React, { useState, useMemo } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "./ui/sidebar";
import Link from "next/link";
import { useNavigation } from "@/hooks/useNavigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import { Label } from "./ui/label";
import { getShortTimeAgo } from "@/lib/utils";

const SidebarRight = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    isRecentlyViewedCoursesLoading,
    isRecentlyViewedMaterialsLoading,
    recentlyViewedCourses,
    recentlyViewedMaterials,
  } = useNavigation();

  const tokens = useMemo(
    () =>
      searchTerm
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.length > 0),
    [searchTerm]
  );

  const filteredMaterials = useMemo(
    () =>
      recentlyViewedMaterials.filter((m) =>
        tokens.every(
          (token) =>
            m.materialTitle.toLowerCase().includes(token) ||
            m.courseTitle.toLowerCase().includes(token)
        )
      ),
    [recentlyViewedMaterials, tokens]
  );

  const filteredCourses = useMemo(
    () =>
      recentlyViewedCourses.filter((c) =>
        tokens.every((token) => c.title.toLowerCase().includes(token))
      ),
    [recentlyViewedCourses, tokens]
  );

  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
    >
      <SidebarHeader>
        <form onSubmit={(e) => e.preventDefault()}>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search recently viewed
              </Label>
              <SidebarInput
                id="search"
                placeholder="Search recently viewed..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recently Viewed Documents</SidebarGroupLabel>
          <SidebarMenu>
            {isRecentlyViewedMaterialsLoading ? (
              <div>
                {[...Array(2)].map((_, i) => (
                  <SidebarMenuSkeleton key={i} />
                ))}
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="flex items-center justify-center h-12 text-muted-foreground">
                <span>No matches</span>
              </div>
            ) : (
              filteredMaterials.map((material) => (
                <SidebarMenuItem key={material.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link
                          href={`/dashboard/course/${material.materialId}`}
                          className="w-full flex justify-between items-center gap-2"
                        >
                          <span className="truncate text-foreground font-medium max-w-[70%]">
                            {material.materialTitle}
                          </span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {getShortTimeAgo(new Date(material.viewedAt))}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-xs text-white">
                        {material.courseTitle}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Recently Viewed Courses</SidebarGroupLabel>
          <SidebarMenu>
            {isRecentlyViewedCoursesLoading ? (
              <div>
                {[...Array(2)].map((_, i) => (
                  <SidebarMenuSkeleton key={i} />
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="flex items-center justify-center h-12 text-muted-foreground">
                <span>No matches</span>
              </div>
            ) : (
              filteredCourses.map((course) => (
                <SidebarMenuItem key={course.id}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={`/dashboard/course/${course.id}`}
                      className="w-full flex justify-between items-center gap-2"
                    >
                      <span className="truncate text-foreground font-medium max-w-[70%]">
                        {course.title}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {getShortTimeAgo(new Date(course.viewedAt))}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarRight;
