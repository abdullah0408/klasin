import { ChevronRight, File, Folder } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type TreeProps = {
  item: string | any[];
  path?: string[];
  openMap: Record<string, boolean>;
  toggleOpen: (key: string) => void;
};

export function Tree({ item, path = [], openMap, toggleOpen }: TreeProps) {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const key = [...path, name].join("/");
  const isOpen = openMap[key] ?? true;

  // compute 16px-per-level indent
  const baseIndent = 16;
  const indentPx = path.length * baseIndent;

  // Leaf node (file)
  if (!items.length) {
    return (
      <div
        style={{ paddingLeft: indentPx + baseIndent }}
        className="flex items-center w-full space-x-2 py-1 px-2 text-sm text-muted-foreground hover:bg-accent rounded-md transition"
      >
        <File className="w-4 h-4" />
        <Link href={`/material/${name}`} className="flex-1 hover:underline">
          {name}
        </Link>
      </div>
    );
  }

  // Folder node
  return (
    <div style={{ paddingLeft: indentPx }}>
      <Collapsible open={isOpen}>
        <CollapsibleTrigger asChild>
          <button
            onClick={() => toggleOpen(key)}
            className="flex items-center w-full space-x-2 py-1 px-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent transition"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            <Folder className="w-4 h-4" />
            <span>{name}</span>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-1">
          {items.map((subItem, i) => (
            <Tree
              key={i}
              item={subItem}
              path={[...path, name]}
              openMap={openMap}
              toggleOpen={toggleOpen}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
