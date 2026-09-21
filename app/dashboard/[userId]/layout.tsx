import VitamindLayout from '@/components/VitamindLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VitamindLayout>{children}</VitamindLayout>;
}
