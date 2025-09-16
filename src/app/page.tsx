
"use client";

import { Header } from "@/components/layout/header";
import { WeatherAlert } from "@/components/dashboard/weather-alert";
import { MarketTrends } from "@/components/dashboard/market-trends";
import { CropMarketplace } from "@/components/dashboard/crop-marketplace";
import { useLanguage } from "@/context/language-context";


export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-4">
             <MarketTrends />
          </div>
          <div className="grid gap-4">
            <WeatherAlert />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            {t('crop_marketplace')}
          </h2>
          <CropMarketplace />
        </div>
      </main>
    </div>
  );
}

    