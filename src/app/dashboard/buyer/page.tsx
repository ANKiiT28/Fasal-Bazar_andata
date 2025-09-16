
import { Header } from "@/components/layout/header";
import { MarketTrends } from "@/components/dashboard/market-trends";
import { SpendingHistory } from "@/components/dashboard/buyer/spending-history";
import { OrdersDashboard } from "@/components/dashboard/buyer/orders-dashboard";
import { PriceAlerts } from "@/components/dashboard/buyer/price-alerts";
import { FavoriteFarmers } from "@/components/dashboard/buyer/favorite-farmers";
import { CommunityRatings } from "@/components/dashboard/buyer/community-ratings";
import { TrackOrder } from "@/components/dashboard/buyer/track-order";


export default function BuyerDashboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Buyer Dashboard</h1>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 grid gap-4 md:gap-8">
                 <TrackOrder />
                 <SpendingHistory />
                 <OrdersDashboard />
                 <MarketTrends />
            </div>
            <div className="grid gap-4 md:gap-8">
                <PriceAlerts />
                <FavoriteFarmers />
                <CommunityRatings />
            </div>
        </div>
      </main>
    </div>
  );
}

    