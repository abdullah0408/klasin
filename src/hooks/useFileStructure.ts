import { FileStructureContext } from "@/contexts/FileStructureContext";
import { useContext } from "react";

export const useFileStructure = () => {
  const ctx = useContext(FileStructureContext);
  if (!ctx) {
    throw new Error(
      "useFileStructure must be used within a FileStructureProvider"
    );
  }
  return ctx;
};

/**
 * Usage Example:
 * --------------
 * "use client";
 * import { useFileStructure } from "@/hooks/useFileStructure";
 *
 * const FileExplorer = () => {
 *   const { fileStructure, isLoading, refreshFileStructure } = useFileStructure();
 *
 *   if (isLoading) return <p>Loading file structure...</p>;
 *
 *   return (
 *     <div>
 *       // Render file structure here
 *     </div>
 *   );
 * };
 *
 * Returned Values:
 * ----------------
 * - `fileStructure`: The current file structure data.
 * - `isLoading`: Boolean indicating if the file structure is currently being loaded.
 */
