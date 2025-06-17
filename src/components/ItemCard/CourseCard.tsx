"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../ui/context-menu";
import { Card, CardContent } from "../ui/card";
import {
  FolderOpen,
  Folder,
  MoreVertical,
  Trash2,
  Folder as FolderIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Course } from "@/generated/prisma";

const CourseCard = ({ course }: { course: Course }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    router.push(`/dashboard/course/${course.id}`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onDoubleClick={handleOpen}
          className="hover:shadow-md transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-border/50 relative py-0"
        >
          <CardContent className="flex items-center p-4 space-x-3">
            <div className="flex-shrink-0">
              {isHovered ? <FolderOpen className="text-primary" /> : <Folder />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {course.title}
                </p>
                <span>•</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(course.createdAt).getFullYear()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(course.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                    }}
                  >
                    <FolderIcon className="w-4 h-4 mr-2" />
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]">
                    <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleOpen}>
          <FolderIcon className="w-4 h-4 mr-2" />
          Open
        </ContextMenuItem>
        <ContextMenuItem className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]">
          <Trash2 className="w-4 h-4 mr-2 text-red-500" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CourseCard;
