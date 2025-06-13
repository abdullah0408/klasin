"use client";

import React, { useState } from "react";
import { ContantGroup, Material } from "@/generated/prisma";
import ItemCard from "@/components/ItemCard";
import PreviewDialog from "@/components/FilePreviewDialog";

export default function CourseDashboard({
  groups,
  materials,
}: {
  groups: ContantGroup[];
  materials: Material[];
}) {
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);

  const items = [...groups, ...materials] as (ContantGroup | Material)[];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onPreview={setPreviewMaterial} />
        ))}
      </div>

      <PreviewDialog
        material={previewMaterial}
        open={!!previewMaterial}
        onOpenChange={(open) => !open && setPreviewMaterial(null)}
      />
    </>
  );
}
