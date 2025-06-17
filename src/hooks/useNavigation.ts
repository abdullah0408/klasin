import { useContext } from "react";
import { NavigationContext } from "@/contexts/NavigationContext";

/**
 * Custom hook to consume NavigationContext.
 * Throws if used outside <NavigationProvider>.
 */
export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return ctx;
};

/**
 * Usage Example:
 * --------------
 * "use client";
 * import { useNavigation } from "@/hooks/useNavigation";
 *
 * const Sidebar = () => {
 *   const {
 *     selectedCourses,
 *     selectedCourseIsLoading,
 *     refreshSelectedCourses,
 *     recentlyViewedCourses,
 *     isRecentlyViewedCoursesLoading,
 *     recentlyViewedMaterials,
 *     isRecentlyViewedMaterialsLoading,
 *     bookmarkedMaterials,
 *     isBookmarkedMaterialsLoading,
 *     refreshBookmarkedMaterials,
 *   } = useNavigation();
 *
 *   return (
 *     // Render logic here...
 *   );
 * };
 *
 * Returned Values:
 * ----------------
 * - `selectedCourses`: Courses the user has selected.
 * - `selectedCourseIsLoading`: Boolean indicating loading state of selected courses.
 * - `refreshSelectedCourses()`: Manually trigger re-fetch of selected courses.
 *
 * - `recentlyViewedCourses`: Courses the user has recently viewed.
 * - `isRecentlyViewedCoursesLoading`: Boolean indicating loading state of recent course views.
 *
 * - `recentlyViewedMaterials`: Recently opened materials across courses.
 * - `isRecentlyViewedMaterialsLoading`: Boolean indicating loading state of recent materials.
 *
 * - `bookmarkedMaterials`: Starred/saved materials by the user.
 * - `isBookmarkedMaterialsLoading`: Boolean indicating loading state of Bookmarks.
 * - `refreshBookmarkedMaterials()`: Manually trigger re-fetch of bookmarked materials.
 */
