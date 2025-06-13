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
import { FileArchive, MoreVertical, File, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Material } from "@/generated/prisma";

const ZipCard = ({ material }: { material: Material }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    router.push(
      `/dashboard/course/${material.courseId}/material/${material.id}`
    );
  };

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const link = document.createElement("a");
    link.href = material.fileUrl;
    link.download = material.title;
    link.click();
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
              {isHovered ? (
                <FileArchive className="text-primary" />
              ) : (
                <FileArchive />
              )}
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
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpen();
                    }}
                  >
                    <File className="w-4 h-4 mr-2" />
                    Open
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleOpen}>
          <File className="w-4 h-4 mr-2" />
          Open
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleDownload()}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ZipCard;
