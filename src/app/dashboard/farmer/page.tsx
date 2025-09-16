
import { Header } from "@/components/layout/header";
import { MarketTrends } from "@/components/dashboard/market-trends";
import { EarningsSummary } from "@/components/dashboard/farmer/earnings-summary";
import { OrdersOverview } from "@/components/dashboard/farmer/orders-overview";
import { DemandForecast } from "@/components/dashboard/farmer/demand-forecast";
import { StorageAndSchemes } from "@/components/dashboard/farmer/storage-and-schemes";
import { Payouts } from "@/components/dashboard/farmer/payouts";
import { LiveDeliveries } from "@/components/dashboard/farmer/live-deliveries";

export default function FarmerDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Farmer Dashboard</h1>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-4 md:gap-8">
                 <LiveDeliveries />
                 <EarningsSummary />
                 <OrdersOverview />
                 <MarketTrends />
            </div>
            <div className="grid gap-4 md:gap-8">
                <DemandForecast />
                <StorageAndSchemes />
                <Payouts />
            </div>
        </div>
      </main>
    </div>
  );
}

    