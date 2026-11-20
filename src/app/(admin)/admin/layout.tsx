import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/widgets/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
  sheet,
}: {
  children: React.ReactNode;
  sheet: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="relative flex min-w-0 flex-1 flex-col">
          <SidebarTrigger />
          <div className="p-6 w-full">{children}</div>
        </main>
        {sheet}
      </SidebarProvider>
    </>
  );
}
