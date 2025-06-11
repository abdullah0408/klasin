import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { enUS } from "date-fns/locale";
import { Prisma } from "@/generated/prisma/client.js";

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

type Material = {
  id: string;
  title: string;
};

export type GroupWithMaterials = {
  id: string;
  title: string;
  parentGroupId: string | null;
  materials: Material[];
};

type Node = {
  id: string;
  title: string;
  children: Node[];
  materials: Material[];
};

export function buildTree(payload: {
  groups: GroupWithMaterials[];
  rootMaterials: Material[];
}): Array<string | any[]> {
  const { groups, rootMaterials } = payload;

  const map = new Map<string, Node>();
  for (const g of groups) {
    map.set(g.id, {
      id: g.id,
      title: g.title,
      children: [],
      materials: g.materials,
    });
  }

  const roots: Node[] = [];
  for (const g of groups) {
    const node = map.get(g.id)!;
    if (g.parentGroupId) {
      const parent = map.get(g.parentGroupId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  function format(nodes: Node[]): Array<string | any[]> {
    const out: Array<string | any[]> = [];
    for (const n of nodes) {
      const childBranches = format(n.children);

      const combined = [...childBranches, ...n.materials.map((m) => m.title)];

      out.push([n.title, ...combined]);
    }
    return out;
  }

  const tree = format(roots);
  for (const m of rootMaterials) {
    tree.push(m.title);
  }
  return tree;
}
