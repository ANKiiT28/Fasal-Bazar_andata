
import { Header } from "@/components/layout/header";
import { PlatformAnalytics } from "@/components/dashboard/admin/platform-analytics";
import { UserManagement } from "@/components/dashboard/admin/user-management";
import { CropManagement } from "@/components/dashboard/admin/crop-management";
import { FraudDetection } from "@/components/dashboard/admin/fraud-detection";

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div id="analytics">
          <PlatformAnalytics />
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <div id="users">
                <UserManagement />
            </div>
            <div id="listings">
                <CropManagement />
            </div>
        </div>
        <div id="fraud-alerts">
            <FraudDetection />
        </div>
      </main>
    </div>
  );
}
