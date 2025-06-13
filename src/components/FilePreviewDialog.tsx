"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Material } from "@/generated/prisma";

export default function FilePreviewDialog({
  material,
  open,
  onOpenChange,
}: {
  material: Material | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onOpenChange(false);
      }}
    >
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base px-4 pt-4">
            {material?.title}
          </DialogTitle>
        </DialogHeader>

        {material?.fileUrl ? (
          <iframe
            src={material.fileUrl}
            className="w-full h-full border-t"
            title="File Preview"
          />
        ) : (
          <p className="text-sm text-center py-4">No preview available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
