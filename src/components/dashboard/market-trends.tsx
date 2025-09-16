
"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, ExternalLink } from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";


const allChartData = {
  Tomatoes: {
    "1W": [
      { date: "Mon", price: 120 }, { date: "Tue", price: 140 }, { date: "Wed", price: 110 }, { date: "Thu", price: 160 }, { date: "Fri", price: 150 }, { date: "Sat", price: 180 }, { date: "Sun", price: 175 },
    ],
  },
  Onions: {
     "1W": [
      { date: "Mon", price: 80 }, { date: "Tue", price: 85 }, { date: "Wed", price: 75 }, { date: "Thu", price: 90 }, { date: "Fri", price: 95 }, { date: "Sat", price: 88 }, { date: "Sun", price: 92 },
    ],
  },
};

const cropColors = {
  Tomatoes: "hsl(var(--chart-1))",
  Onions: "hsl(var(--chart-2))",
};


type CropName = keyof typeof allChartData;

export function MarketTrends() {
  const { t } = useLanguage();
  const selectedCrops: CropName[] = ["Tomatoes", "Onions"];

  const chartData = allChartData.Tomatoes["1W"].map((_, i) => {
    const dataPoint: { [key: string]: any } = { date: allChartData.Tomatoes["1W"][i].date };
    selectedCrops.forEach(crop => {
      dataPoint[crop] = allChartData[crop]["1W"][i]?.price;
    });
    return dataPoint;
  });
  
  const firstSelectedCrop = selectedCrops.length > 0 ? selectedCrops[0] : null;
  const trendData = firstSelectedCrop ? allChartData[firstSelectedCrop]["1W"] : [];
  const trend = trendData.length > 0 ? trendData[trendData.length - 1].price - trendData[0].price : 0;
  
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "text-primary" : trend < 0 ? "text-destructive" : "text-muted-foreground";
  const trendText = trend > 0 ? t('rising') : trend < 0 ? t('dropping') : t('stable');

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div>
                <CardTitle className="text-lg">{t('market_price_trends')}</CardTitle>
                <CardDescription>
                    {t('historical_price_for', { crops: selectedCrops.map(c => t(c)).join(', ') })}
                </CardDescription>
            </div>
            {firstSelectedCrop && (
                <div className="flex items-center gap-1 p-2 rounded-md bg-secondary mt-2 sm:mt-0">
                    <TrendIcon className={`h-6 w-6 ${trendColor}`} />
                    <span className={`font-semibold ${trendColor}`}>
                        {t(firstSelectedCrop)}: {trendText}
                    </span>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -30, bottom: 5 }}
            >
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `Rs. ${value}`}
                    fontSize={12}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                    }}
                />
                {selectedCrops.map(crop => (
                    <Line
                        key={crop}
                        dataKey={crop}
                        type="monotone"
                        stroke={cropColors[crop]}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        name={t(crop)}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button size="sm" variant="outline" asChild>
          <Link href="/market-insights">
            <ExternalLink className="mr-2 h-4 w-4" />
            {t('view_market_insights')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
