import ViewTracker from "@/components/ViewTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div>{children}</div>
      <ViewTracker for={"material"} />
    </>
  );
}
