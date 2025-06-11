import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getShortTimeAgo(date: Date) {
  const diff = formatDistanceToNowStrict(date, {
    addSuffix: false,
    locale: {
      ...enUS,
      formatDistance: (token, count) => {
        const shortFormats = {
          lessThanXSeconds: `${count}s`,
          xSeconds: `${count}s`,
          halfAMinute: `30s`,
          lessThanXMinutes: `${count}m`,
          xMinutes: `${count}m`,
          aboutXHours: `${count}h`,
          xHours: `${count}h`,
          xDays: `${count}d`,
          aboutXWeeks: `${count}w`,
          xWeeks: `${count}w`,
          aboutXMonths: `${count}mo`,
          xMonths: `${count}mo`,
          aboutXYears: `${count}y`,
          xYears: `${count}y`,
          overXYears: `${count}y`,
          almostXYears: `${count}y`,
        };
        return shortFormats[token] ?? "";
      },
    },
  });

  return diff;
}
