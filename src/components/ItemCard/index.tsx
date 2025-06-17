"use client";

import React from "react";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
import ZipCard from "./ZipCard";
import { ContantGroup, Material } from "@/generated/prisma";

const ItemCard = ({
  item,
  onPreview,
}: {
  item:
    | ContantGroup
    | (Material & {
        ReadMaterial?: { userId: string }[];
        bookmarked?: { userId: string }[];
      });
  onPreview?: (
    material: Material & {
      ReadMaterial?: { userId: string }[];
      bookmarked?: { userId: string }[];
    }
  ) => void;
}) => {
  switch (item.type) {
    case "Folder":
      return <FolderCard group={item as ContantGroup} />;
    case "File":
      return (
        <FileCard
          material={
            item as Material & {
              ReadMaterial?: { userId: string }[];
              bookmarked?: { userId: string }[];
            }
          }
          onPreview={onPreview}
        />
      );
    case "Zip":
      return (
        <ZipCard
          material={
            item as Material & {
              ReadMaterial?: { userId: string }[];
              bookmarked?: { userId: string }[];
            }
          }
        />
      );
    default:
      return null;
  }
};

export default ItemCard;
