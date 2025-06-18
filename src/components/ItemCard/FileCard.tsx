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
import {
  MoreVertical,
  File,
  Eye,
  FileText,
  Trash2,
  // BookMarked,
  // BookmarkCheck,
  // Bookmark,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { formatDistanceToNow } from "date-fns";
import { Material } from "@/generated/prisma";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const FileCard = ({
  material,
  onPreview,
}: {
  material: Material & {
    ReadMaterial?: { userId: string }[];
    // bookmarked?: { userId: string }[];
  };
  onPreview?: (
    material: Material & {
      ReadMaterial?: { userId: string }[];
      // bookmarked?: { userId: string }[];
    }
  ) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isRead, setIsRead] = useState(
    !!((material.ReadMaterial?.length ?? 0) > 0)
  );
  // const [isBookMarked, setIsBookMarked] = useState(
  //   !!((material.bookmarked?.length ?? 0) > 0)
  // );
  const [readLoading, setReadLoading] = useState(false);
  // const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(
      `/dashboard/course/${material.courseId}/material/${material.id}`
    );
  };

  const toggleRead = async (val: boolean) => {
    try {
      setReadLoading(true);
      const res = await fetch("/api/material/read", {
        method: "POST",
        body: JSON.stringify({
          materialId: material.id,
          isRead: val,
        }),
      });

      if (res.ok) {
        setIsRead(val);
      } else {
        console.error("Failed to update read status");
      }
    } catch (err) {
      console.error("Error toggling read status:", err);
    } finally {
      setReadLoading(false);
    }
  };

  // const toggleBookmark = async (val: boolean) => {
  //   try {
  //     setBookmarkLoading(true);
  //     const res = await fetch("/api/material/bookmark", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         materialId: material.id,
  //         isRead: val,
  //       }),
  //     });

  //     if (res.ok) {
  //       setIsBookMarked(val);
  //     } else {
  //       console.error("Failed to update bookmark status");
  //     }
  //   } catch (err) {
  //     console.error("Error toggling bookmark status:", err);
  //   } finally {
  //     setBookmarkLoading(false);
  //   }
  // };

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
                <DropdownMenuContent align="end" className="w-56">
                  {/* Primary actions */}
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
                  <DropdownMenuItem asChild>
                    <a
                      href={`${process.env.NEXT_PUBLIC_R2_Public_URL}/${material.fileUrl}`}
                      download
                      target="_blank"
                      className="flex items-center w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </DropdownMenuItem>

                  {/* Read/Bookmark toggles */}
                  <div className="flex items-center px-2 py-1.5 space-x-2 text-sm cursor-default select-none">
                    <Switch
                      id="read-switch"
                      checked={isRead}
                      onCheckedChange={(val) => toggleRead(val)}
                      disabled={readLoading}
                      className="cursor-pointer border-foreground-"
                    />
                    <Label htmlFor="read-switch" className="cursor-pointer">
                      {isRead ? "Mark as Unread" : "Mark as Read"}
                    </Label>
                  </div>
                  {/* <DropdownMenuItem
                    disabled={bookmarkLoading}
                    className={
                      bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!bookmarkLoading) {
                        toggleBookmark(!isBookMarked);
                      }
                    }}
                  >
                    {isBookMarked ? (
                      <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4 mr-2" />
                    )}
                    {isBookMarked ? "Remove Bookmark" : "Add to Bookmarks"}
                  </DropdownMenuItem> */}

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

        <ContextMenuItem asChild>
          <a
            href={`${process.env.NEXT_PUBLIC_R2_Public_URL}/${material.fileUrl}`}
            download
            target="_blank"
            className="flex items-center w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        </ContextMenuItem>

        {/* Toggle switches */}
        <div className="flex items-center px-2 py-1.5 space-x-2 text-sm cursor-default select-none">
          <Switch
            id="read-switch"
            checked={isRead}
            onCheckedChange={(val) => toggleRead(val)}
            disabled={readLoading}
            className="cursor-pointer border-foreground-"
          />
          <Label htmlFor="read-switch" className="cursor-pointer">
            {isRead ? "Mark as Unread" : "Mark as Read"}
          </Label>
        </div>

        {/* <ContextMenuItem
          disabled={bookmarkLoading}
          className={bookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}
          onClick={(e) => {
            e.stopPropagation();
            if (!bookmarkLoading) {
              toggleBookmark(!isBookMarked);
            }
          }}
        >
          {isBookMarked ? (
            <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4 mr-2" />
          )}
          {isBookMarked ? "Remove Bookmark" : "Add to Bookmarks"}
        </ContextMenuItem> */}

        {/* Destructive action */}
        <ContextMenuItem className="!text-red-500 hover:!text-red-600 hover:!bg-[rgba(239,68,68,0.1)]">
          <Trash2 className="w-4 h-4 mr-2 text-red-500 hover:!text-red-600" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FileCard;
