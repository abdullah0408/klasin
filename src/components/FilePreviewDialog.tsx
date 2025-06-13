"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Material } from "@/generated/prisma";
import Link from "next/link";
import { Download, LayoutPanelTop } from "lucide-react";

export default function FilePreviewDialog({
  material,
  open,
  onOpenChange,
}: {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const viewerUrl = material?.fileUrl
    ? `https://docs.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(
        `https://pub-cf3bbc29c390439db6d1b0fa281920af.r2.dev/${material.fileUrl}`
      )}`
    : null;

  console.log("Viewer URL:", viewerUrl);

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onOpenChange(false);
      }}
    >
      <DialogContent className="min-w-[99vw] gap-0 sm:min-w-[60vw] h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-4 pt-4 pb-3 flex items-center justify-between">
          <DialogTitle className="text-base">{material?.title}</DialogTitle>
        </DialogHeader>
        {viewerUrl ? (
          <iframe
            src={viewerUrl}
            className="flex-1 w-full border-t"
            title="File Preview"
          />
        ) : (
          <p className="text-sm text-center py-4">No preview available</p>
        )}

        {material?.fileUrl && (
          <div className="flex gap-2 justify-end px-4 py-3">
            <a
              href={`https://pub-cf3bbc29c390439db6d1b0fa281920af.r2.dev/${material.fileUrl}`}
              download
              target="_blank"
            >
              <Button variant="outline" className="cursor-pointer">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </a>

            <Link
              href={`/courses/${material.courseId}/materials/${material.id}`}
            >
              <Button variant="default" className="cursor-pointer">
                <LayoutPanelTop className="w-4 h-4" />
                Full View
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
