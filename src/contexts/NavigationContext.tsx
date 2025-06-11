"use client";

import React, { createContext, useEffect, useState } from "react";
import { Course, CourseView, MaterialView } from "@/generated/prisma/client.js";
import { useUser } from "@clerk/nextjs";

interface NavigationContextType {
  selectedCourses: Course[];
  refreshSelectedCourses: () => void;
  selectedCourseIsLoading: boolean;
  recentlyViewedCourses: (CourseView & { title: string; code: string })[];
  isRecentlyViewedCoursesLoading: boolean;
  isRecentlyViewedMaterialsLoading: boolean;
  recentlyViewedMaterials: (MaterialView & {
    materialTitle: string;
    code: string;
    courseId: string;
    courseTitle: string;
  })[];
  isFavoriteMaterialsLoading: boolean;
  favoriteMaterials: {
    materialId: string;
    material: {
      id: string;
      title: string;
      fileUrl: string;
      course: { title: string };
    };
  }[];
  refreshFavoriteMaterials: () => void;
}

export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined);

/**
 * NavigationProvider tracks and manages:
 *   - Selected courses for the user
 *   - Recently viewed courses and materials
 *   - Favorite materials
 *
 * Data is fetched from corresponding API endpoints. Context consumers can access this data
 * and loading states, and can trigger refresh manually.
 */
export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // useUser() from @clerk/nextjs gives us:
  //   - isSignedIn: whether Clerk thinks someone is signed in
  //   - isLoaded: whether Clerk has finished loading user data on the client
  const { isSignedIn, isLoaded } = useUser();

  // Selected courses
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [selectedCourseIsLoading, setSelectedCourseIsLoading] = useState(true);

  // Recently viewed courses
  const [recentlyViewedCourses, setRecentlyViewedCourses] = useState<
    (CourseView & { title: string; code: string })[]
  >([]);
  const [isRecentlyViewedCoursesLoading, setIsRecentlyViewedCoursesLoading] =
    useState(true);

  // Recently viewed materials
  const [
    isRecentlyViewedMaterialsLoading,
    setIsRecentlyViewedMaterialsLoading,
  ] = useState(true);
  const [recentlyViewedMaterials, setRecentlyViewedMaterials] = useState<
    (MaterialView & {
      materialTitle: string;
      code: string;
      courseId: string;
      courseTitle: string;
    })[]
  >([]);

  // Favorite materials
  const [isFavoriteMaterialsLoading, setIsFavoriteMaterialsLoading] =
    useState(true);
  const [favoriteMaterials, setFavoriteMaterials] = useState<
    {
      materialId: string;
      material: {
        id: string;
        title: string;
        fileUrl: string;
        course: { title: string };
      };
    }[]
  >([]);

  /**
   * Fetch favorite materials for the current user.
   */
  const fetchFavoriteMaterials = async () => {
    try {
      const res = await fetch("/api/course/material/favorite");
      if (!res.ok)
        throw new Error(`Failed to fetch favorite materials: ${res.status}`);
      const data = await res.json();
      setFavoriteMaterials(data);
    } catch (err) {
      console.error("Error in NavigationProvider.fetchFavoriteMaterials:", err);
      setFavoriteMaterials([]);
    } finally {
      setIsFavoriteMaterialsLoading(false);
    }
  };

  /**
   * Fetch recently viewed materials for the current user.
   * This is also polled every minute when user is signed in.
   */
  const fetchRecentlyViewedMaterials = async () => {
    try {
      const res = await fetch("/api/course/material/recent-viewed");
      if (!res.ok)
        throw new Error(
          `Failed to fetch recently viewed materials: ${res.status}`
        );
      const data = await res.json();
      setRecentlyViewedMaterials(data);
    } catch (err) {
      console.error(
        "Error in NavigationProvider.fetchRecentlyViewedMaterials:",
        err
      );
      setRecentlyViewedMaterials([]);
    } finally {
      setIsRecentlyViewedMaterialsLoading(false);
    }
  };

  /**
   * Set up polling of recently viewed materials every 1 minute.
   */
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isSignedIn && isLoaded) {
      fetchRecentlyViewedMaterials(); // Initial fetch
      intervalId = setInterval(() => {
        fetchRecentlyViewedMaterials();
      }, 60 * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSignedIn, isLoaded]);

  /**
   * Fetch courses selected by the user.
   */
  const fetchSelectedCourses = async () => {
    try {
      const res = await fetch("/api/course/selected-courses");
      if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`);
      const data = await res.json();
      setSelectedCourses(data);
    } catch (err) {
      console.error("Error in NavigationProvider.fetchSelectedCourses:", err);
      setSelectedCourses([]);
    } finally {
      setSelectedCourseIsLoading(false);
    }
  };

  /**
   * Fetch recently viewed courses for the current user.
   * This is also polled every minute when signed in.
   */
  const fetchRecentlyViewedCourses = async () => {
    try {
      const res = await fetch("/api/course/recent-viewed");
      if (!res.ok)
        throw new Error(
          `Failed to fetch recently viewed courses: ${res.status}`
        );
      const data = await res.json();
      setRecentlyViewedCourses(data);
    } catch (err) {
      console.error(
        "Error in NavigationProvider.fetchRecentlyViewedCourses:",
        err
      );
      setRecentlyViewedCourses([]);
    } finally {
      setIsRecentlyViewedCoursesLoading(false);
    }
  };

  /**
   * Poll recently viewed courses every minute.
   */
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isSignedIn && isLoaded) {
      fetchRecentlyViewedCourses(); // Initial fetch
      intervalId = setInterval(() => {
        fetchRecentlyViewedCourses();
      }, 60 * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSignedIn, isLoaded]);

  /**
   * Fetch selected courses when user is authenticated.
   */
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      fetchSelectedCourses();
    }
  }, [isSignedIn, isLoaded]);

  /**
   * Fetch favorite materials when user is authenticated.
   */
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      fetchFavoriteMaterials();
    }
  }, [isSignedIn, isLoaded]);

  return (
    <NavigationContext.Provider
      value={{
        selectedCourseIsLoading,
        selectedCourses,
        refreshSelectedCourses: fetchSelectedCourses,
        recentlyViewedCourses,
        isRecentlyViewedCoursesLoading,
        isRecentlyViewedMaterialsLoading,
        recentlyViewedMaterials,
        isFavoriteMaterialsLoading,
        favoriteMaterials,
        refreshFavoriteMaterials: fetchFavoriteMaterials,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
