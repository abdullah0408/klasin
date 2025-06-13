import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ViewTracker from "@/components/ViewTracker";
import { NavigationProvider } from "@/contexts/NavigationContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <SidebarProvider>
        <NavigationProvider>
          <SidebarLeft />
          <SidebarInset>{children}</SidebarInset>
          <SidebarRight />
        </NavigationProvider>
      </SidebarProvider>
      <ViewTracker for={"course"}/>
    </div>
  );
}
