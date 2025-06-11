import { FileStructureProvider } from "@/contexts/FileStructureContext";
import FloatingFileStructurePopover from "@/components/FloatingFileStructurePopover";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <FileStructureProvider>
      <div className="relative min-h-screen">
        {children}
        <FloatingFileStructurePopover />
      </div>
    </FileStructureProvider>
  );
}
