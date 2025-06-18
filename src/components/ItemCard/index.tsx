"use client";

import React from "react";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
import ZipCard from "./ZipCard";
import { ContantGroup, Course, Material } from "@/generated/prisma";
import CourseCard from "./CourseCard";

const ItemCard = ({
  item,
  onPreview,
  onDeleteMaterialSuccess,
  onDeleteCourseSuccess,
  onDeleteGroupSuccess,
}: {
  item:
    | ContantGroup
    | (Material & {
        ReadMaterial?: { userId: string }[];
        // bookmarked?: { userId: string }[];
      })
    | Course;
  onPreview?: (
    material: Material & {
      ReadMaterial?: { userId: string }[];
      // bookmarked?: { userId: string }[];
    }
  ) => void;
  onDeleteMaterialSuccess?: (deletedId: string) => void;
  onDeleteCourseSuccess?: (deletedId: string) => void;
  onDeleteGroupSuccess?: (deletedId: string) => void;
}) => {
  switch (item.type) {
    case "Folder":
      return (
        <FolderCard
          group={item as ContantGroup}
          onDeleteGroupSuccess={onDeleteGroupSuccess}
        />
      );
    case "File":
      return (
        <FileCard
          material={
            item as Material & {
              ReadMaterial?: { userId: string }[];
              // bookmarked?: { userId: string }[];
            }
          }
          onPreview={onPreview}
          onDeleteMaterialSuccess={onDeleteMaterialSuccess}
        />
      );
    case "Zip":
      return (
        <ZipCard
          material={
            item as Material & {
              ReadMaterial?: { userId: string }[];
              // bookmarked?: { userId: string }[];
            }
          }
          onDeleteMaterialSuccess={onDeleteMaterialSuccess}
        />
      );
    case "Course":
      return (
        <CourseCard
          course={item as Course}
          onDeleteCourseSuccess={onDeleteCourseSuccess}
        />
      );
    default:
      return null;
  }
};

export default ItemCard;
