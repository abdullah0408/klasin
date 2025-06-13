"use client";

import React from "react";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
import ZipCard from "./ZipCard";
import { ContantGroup, Material } from "@/generated/prisma";

type Item = ContantGroup | Material;

const ItemCard = ({
  item,
  onPreview,
}: {
  item: Item;
  onPreview?: (material: Material) => void;
}) => {
  switch (item.type) {
    case "Folder":
      return <FolderCard group={item as ContantGroup} />;
    case "File":
      return <FileCard material={item as Material} onPreview={onPreview} />;
    case "Zip":
      return <ZipCard material={item as Material} />;
    default:
      return null;
  }
};

export default ItemCard;
