"use client";

import React, { useState, useMemo } from "react";
import {
  ContantGroup,
  Material,
  MaterialType,
  ReadMaterial,
} from "@/generated/prisma";
import ItemCard from "@/components/ItemCard";
import PreviewDialog from "@/components/FilePreviewDialog";
import FileUploadDialog from "@/components/FileUploadDialog";
import CreateFolderDialog from "./CreateFolderDialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SidebarTrigger } from "./ui/sidebar";

type SortOption = "dateDesc" | "dateAsc" | "alphaAsc" | "alphaDesc";
type FilterType = "all" | "folder" | "file";

export default function CourseDashboard({
  groups,
  materials,
}: {
  groups: ContantGroup[];
  materials: (Material & {
    ReadMaterial?: { userId: string }[];
  } & {
    bookmarked?: { userId: string }[];
  })[];
}) {
  const [groupData, setGroupData] = useState(groups);
  const [materialData, setMaterialData] = useState(materials);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("dateDesc");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const { userDetails, isLoading, isSignedIn, isLoaded } = useAuth();

  const handleNewMaterial = (material: Material) => {
    setMaterialData((prev) => [...prev, material]);
  };

  const handleNewGroup = (group: ContantGroup) => {
    setGroupData((prev) => [...prev, group]);
  };

  const items = useMemo(() => {
    const groupItems = groupData.map((group) => ({
      id: group.id,
      title: group.title ?? "",
      description: group.description ?? "",
      type: "Folder" as const,
      createdAt: group.createdAt ?? new Date(0),
      raw: group,
    }));
    const materialItems = materialData.map((material) => ({
      id: material.id,
      title: material.title ?? "",
      description: material.description ?? "",
      type: material.type === MaterialType.Zip ? "Zip" : "File",
      createdAt: material.createdAt ?? new Date(0),
      raw: material,
    }));
    return [...groupItems, ...materialItems];
  }, [groupData, materialData]);

  const visibleItems = useMemo(() => {
    return items
      .filter((item) => {
        if (filterType === "folder") return item.type === "Folder";
        if (filterType === "file") return item.type !== "Folder";
        return true;
      })
      .filter((item) => {
        const term = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "Folder" ? -1 : 1;
        }

        const aTime =
          a.createdAt instanceof Date
            ? a.createdAt.getTime()
            : new Date(a.createdAt ?? 0).getTime();
        const bTime =
          b.createdAt instanceof Date
            ? b.createdAt.getTime()
            : new Date(b.createdAt ?? 0).getTime();

        switch (sortOption) {
          case "dateDesc":
            return bTime - aTime;
          case "dateAsc":
            return aTime - bTime;
          case "alphaAsc":
            return a.title.localeCompare(b.title);
          case "alphaDesc":
            return b.title.localeCompare(a.title);
        }
      });
  }, [items, searchTerm, filterType, sortOption]);

  const controlClass = "max-w-[100px] flex-1 text-sm border-foreground-";

  return (
    <>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4 pb-4">

        <div className="w-full lg:max-w-sm flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm border-foreground-"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            onValueChange={(v) => setSortOption(v as SortOption)}
            value={sortOption}
          >
            <SelectTrigger size="sm" className={controlClass}>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dateDesc">Newest</SelectItem>
              <SelectItem value="dateAsc">Oldest</SelectItem>
              <SelectItem value="alphaAsc">A → Z</SelectItem>
              <SelectItem value="alphaDesc">Z ← A</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => setFilterType(v as FilterType)}
            value={filterType}
          >
            <SelectTrigger size="sm" className={controlClass}>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="folder">Folders</SelectItem>
              <SelectItem value="file">Files</SelectItem>
            </SelectContent>
          </Select>

          {isLoaded &&
            isSignedIn &&
            !isLoading &&
            userDetails &&
            userDetails.role == "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="text-sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Upload
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFileDialogOpen(true)}>
                    Upload File
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFolderDialogOpen(true)}>
                    Create Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleItems.map((item) => (
          <ItemCard
            key={`${item.type}:${item.id}`}
            item={item.raw}
            onPreview={(m: Material) => setPreviewMaterial(m)}
          />
        ))}
      </div>

      <PreviewDialog
        material={previewMaterial}
        open={!!previewMaterial}
        onOpenChange={(open) => !open && setPreviewMaterial(null)}
      />

      <FileUploadDialog
        open={fileDialogOpen}
        onOpenChange={setFileDialogOpen}
        onSuccess={handleNewMaterial}
      />

      <CreateFolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        onSuccess={handleNewGroup}
      />
    </>
  );
}
