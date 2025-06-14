"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Material, MaterialType } from "@/generated/prisma";
import { useParams } from "next/navigation";

type UploadResponse = {
  success: boolean;
  material: Material & { createdAt: string; updatedAt: string };
};

const getBaseFileName = (filename: string) => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot === -1 ? filename : filename.substring(0, lastDot);
};

export default function FileUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (material: Material) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const params = useParams();
  const courseId = params.courseId as string;
  const groupId = params.groupId as string | undefined;

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length) {
      setFile(accepted[0]);
      setTitle(getBaseFileName(accepted[0].name));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/material");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = async () => {
      setIsUploading(false);

      if (xhr.status >= 200 && xhr.status < 300) {
        let wrapper: UploadResponse;
        try {
          wrapper = JSON.parse(xhr.responseText);
        } catch (err) {
          toast.error("Unexpected server response");
          return;
        }

        if (!wrapper.success) {
          toast.error("Upload failed on server");
          return;
        }

        const data = wrapper.material;

        const material: Material = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          type: data.type as MaterialType,
        };

        toast.success(`"${material.title}" uploaded`);
        onSuccess?.(material);
        onOpenChange(false);
      } else {
        toast.error(`Upload failed: ${xhr.responseText}`);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      toast.error("Network error. Please try again.");
    };

    const form = new FormData();
    form.append("file", file);
    form.append("title", title);
    form.append("description", description);
    form.append("courseId", courseId);
    if (groupId) form.append("groupId", groupId);

    xhr.send(form);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !isUploading && onOpenChange(o)}>
      <DialogContent
        className="max-w-lg w-full sm:w-[90%] px-4 sm:px-6 py-6 space-y-5"
        forceMount
      >
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Select a file, add a title/description, and upload.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`p-4 border-2 border-dashed rounded-md text-center cursor-pointer text-sm break-words ${
              isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {file
              ? getBaseFileName(file.name)
              : "Drag & drop a file here, or click to select"}
          </div>

          {/* Title & Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="file-title">Title</Label>
              <Input
                id="file-title"
                value={title}
                maxLength={100}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                className="truncate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-desc">Description</Label>
              <Input
                id="file-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                maxLength={300}
              />
            </div>
          </div>

          {isUploading && <Progress value={progress} className="h-2" />}

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !file}>
              {isUploading ? `Uploading ${progress}%` : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
