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
  Folder as FolderIcon,
  Paperclip,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { ContantGroup } from "@/generated/prisma";

const FolderCard = ({ group }: { group: ContantGroup }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(`/dashboard/course/${group.courseId}/group/${group.id}`);
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
          {/* <div className="absolute top-0 left-0.5">
            <Paperclip className="w-4 h-4 text-primary -rotate-90" />
          </div> */}
          <CardContent className="flex items-center p-4 space-x-3">
            <div className="flex-shrink-0">
              {isHovered ? <FolderOpen className="text-primary" /> : <Folder />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {group.title}
                </p>
                <span>•</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(group.createdAt).getFullYear()}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <span className="truncate">
                  {formatDistanceToNow(new Date(group.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
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
                      handleDoubleClick();
                    }}
                  >
                    <FolderIcon className="w-4 h-4 mr-2" />
                    Open
                  </DropdownMenuItem>
                  {/* Destructive action last */}
                  <DropdownMenuItem className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]">
                    <Trash2 className="w-4 h-4 mr-2 text-red-500 hover:!text-red-600" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {/* Primary actions */}
        <ContextMenuItem onClick={handleDoubleClick}>
          <FolderIcon className="w-4 h-4 mr-2" />
          Open
        </ContextMenuItem>

        {/* Destructive action */}
        <ContextMenuItem className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]">
          <Trash2 className="w-4 h-4 mr-2 text-red-500 hover:!text-red-600" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FolderCard;
