import AdminSidebar from "@/components/layouts/AdminSidebar";

export default function AdminSidebarLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <div className="flex">
   <AdminSidebar />
   <main className="ml-64">{children}</main>
  </div>
 );
}
