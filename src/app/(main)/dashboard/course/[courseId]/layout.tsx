import { FileStructureProvider } from "@/contexts/FileStructureContext";
import FloatingFileStructurePopover from "@/components/FloatingFileStructurePopover";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <FileStructureProvider>
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {children}
        <FloatingFileStructurePopover />
      </div>
    </FileStructureProvider>
  );
}
