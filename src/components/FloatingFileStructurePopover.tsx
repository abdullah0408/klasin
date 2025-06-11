"use client";

import { useState } from "react";
import { useFileStructure } from "@/hooks/useFileStructure";
import { Tree } from "@/components/Tree";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "./ui/skeleton";
import { Folder, FolderOpen } from "lucide-react";

export default function FloatingFileStructurePopover() {
  const { isLoading, fileStructure } = useFileStructure();
  const [open, setOpen] = useState(false);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleOpen = (key: string) =>
    setOpenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="absolute bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="rounded-full w-12 h-12 p-0">
            {open ? (
              <FolderOpen className="w-5 h-5" />
            ) : (
              <Folder className="w-5 h-5" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          align="end"
          sideOffset={8}
          className="w-fit max-w-xs p-4"
        >
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ) : fileStructure.length > 0 ? (
            <div className="space-y-1 text-sm">
              {fileStructure.map((item, i) => (
                <Tree
                  key={i}
                  item={item}
                  openMap={openMap}
                  toggleOpen={toggleOpen}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <p className="text-center text-xs text-muted-foreground">
                No files available
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
