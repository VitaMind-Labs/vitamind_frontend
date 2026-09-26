import VitamindLayout from "@/components/dashboard/VitamindLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VitamindLayout>{children}</VitamindLayout>;
}
