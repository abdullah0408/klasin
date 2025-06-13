"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

type ViewTrackerProps = {
  for: "course" | "material";
};

const ViewTracker = ({ for: type }: ViewTrackerProps) => {
  const params = useParams();
  const lastTrackedId = useRef<string | null>(null);

  useEffect(() => {
    if (type === "course") {
      const courseId = params.courseId;
      if (!courseId || typeof courseId !== "string") return;

      if (lastTrackedId.current === courseId) return;
      lastTrackedId.current = courseId;

      fetch(`/api/course/view?courseId=${courseId}`, {
        method: "POST",
      }).catch((err) => {
        console.error("Failed to track course view:", err);
      });
    }

    if (type === "material") {
      const materialId = params.materialId;
      if (!materialId || typeof materialId !== "string") return;

      if (lastTrackedId.current === materialId) return; // already tracked
      lastTrackedId.current = materialId;

      fetch(`/api/course/material/view?materialId=${materialId}`, {
        method: "POST",
      }).catch((err) => {
        console.error("Failed to track material view:", err);
      });
    }
  }, [type, params.courseId, params.materialId]);

  return null;
};

export default ViewTracker;
