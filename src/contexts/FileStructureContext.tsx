"use client";

import React, { createContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { buildTree } from "@/lib/utils";

interface FileStructureContextType {
  isLoading: boolean;
  fileStructure: any[];
}

export const FileStructureContext = createContext<
  FileStructureContextType | undefined
>(undefined);

export const FileStructureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [fileStructure, setFileStructure] = useState<any[]>([]);
  const params = useParams<{ courseId?: string }>();

  /**
   * Fetches the file structure for the course and builds a file structure.
   * If the courseId is not provided, it sets an empty file structure.
   */
  const fetchFileStructure = async () => {
    if (!params.courseId) return;
    try {
      const res = await fetch(
        `/api/course/file-structure?courseId=${params.courseId}`
      );
      if (!res.ok)
        throw new Error(`Failed to fetch file structure: ${res.status}`);

      const { groups, rootMaterials } = await res.json();
      const tree = buildTree({ groups, rootMaterials });
      setFileStructure(tree);
    } catch {
      setFileStructure([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches the file structure when the courseId changes.
   * If no courseId is provided, it resets the file structure and loading state.
   */

  useEffect(() => {
    if (params.courseId) {
      setIsLoading(true);
      fetchFileStructure();
    } else {
      setFileStructure([]);
      setIsLoading(false);
    }
  }, [params.courseId]);

  return (
    <FileStructureContext.Provider value={{ isLoading, fileStructure }}>
      {children}
    </FileStructureContext.Provider>
  );
};
