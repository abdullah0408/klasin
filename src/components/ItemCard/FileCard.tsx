"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Card, CardContent } from "../ui/card";
import { MoreVertical, File, Eye, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Material } from "@/generated/prisma";

const FileCard = ({
  material,
  onPreview,
}: {
  material: Material;
  onPreview?: (material: Material) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(
      `/dashboard/course/${material.courseId}/material/${material.id}`
    );
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onDoubleClick={handleDoubleClick}
          className="hover:shadow-md transition-all duration-200 hover:bg-accent/50 cursor-pointer border border-border/50 relative py-0"
        >
          <CardContent className="flex items-center p-4 space-x-3">
            <div className="flex-shrink-0">
              {isHovered ? <FileText className="text-primary" /> : <File />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {material.title}
                </p>
                <span>•</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(material.createdAt).getFullYear()}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span className="truncate">
                  {formatDistanceToNow(new Date(material.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview?.(material);
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
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
                    onClick={() =>
                      router.push(
                        `/dashboard/course/${material.courseId}/material/${material.id}`
                      )
                    }
                  >
                    <File className="w-4 h-4 mr-2" />
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPreview?.(material)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem
          onClick={() =>
            router.push(
              `/dashboard/course/${material.courseId}/material/${material.id}`
            )
          }
        >
          <File className="w-4 h-4 mr-2" />
          Open
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onPreview?.(material)}>
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FileCard;
