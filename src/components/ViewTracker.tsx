"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

type ViewTrackerProps = {
  for: "course" | "material";
};

const ViewTracker = ({ for: type }: ViewTrackerProps) => {
  const params = useParams();

  useEffect(() => {
    const id = type === "course" ? params.courseId : params.materialId;
    if (!id || typeof id !== "string") return;

    const endpoint =
      type === "course"
        ? `/api/course/view?courseId=${id}`
        : `/api/course/material/view?materialId=${id}`;

    fetch(endpoint, {
      method: "POST",
    }).catch((err) => {
      console.error(`Failed to track ${type} view:`, err);
    });
  }, [type, params]);

  return null;
};

export default ViewTracker;
