
"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { TrendingUp, Wand2, ArrowLeft } from "lucide-react";
import { predictFuturePrice, type PredictFuturePriceOutput } from "@/ai/flows/price-prediction";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { allChartData, cropColors } from "@/lib/market-data";
import type { CropName, Timeframe } from "@/lib/market-data";


export default function MarketInsightsPage() {
    const { t } = useLanguage();
    const [timeframe, setTimeframe] = useState<Timeframe>("6M");
    const [selectedCrop, setSelectedCrop] = useState<CropName>("Tomato");
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    const [prediction, setPrediction] = useState<PredictFuturePriceOutput | null>(null);
    const { toast } = useToast();
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        // Set the current date and time on the client side to avoid hydration errors
        const now = new Date();
        const formattedDate = new Intl.DateTimeFormat('en-IN', { 
            dateStyle: 'full', 
            timeStyle: 'long' 
        }).format(now);
        setCurrentDate(formattedDate);

        const timer = setInterval(() => {
             const now = new Date();
             const formattedDate = new Intl.DateTimeFormat('en-IN', { 
                dateStyle: 'full', 
                timeStyle: 'long' 
            }).format(now);
            setCurrentDate(formattedDate);
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    const handleSelectCrop = (crop: CropName) => {
        setSelectedCrop(crop);
        setPrediction(null);
    }
    
    const handlePredictPrice = async () => {
        setLoadingPrediction(true);
        setPrediction(null);
        try {
            // Using 6M data for a more comprehensive prediction
            const historicalData = allChartData[selectedCrop]["6M"].map(d => ({ month: d.date, price: d.price }));
            const result = await predictFuturePrice({ cropName: selectedCrop, historicalData });
            setPrediction(result);
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.message && error.message.includes('503') 
                ? "The AI model is currently overloaded. Please try again in a moment."
                : "Could not predict the future price. Please try again.";
            toast({
                variant: "destructive",
                title: "Prediction Failed",
                description: errorMessage,
            });
        }
        setLoadingPrediction(false);
    }
  
    const chartData = useMemo(() => {
        if (!selectedCrop) return [];
        return allChartData[selectedCrop][timeframe];
    }, [selectedCrop, timeframe]);

    const chartConfig = {
        price: { label: t(selectedCrop), color: cropColors[selectedCrop] || "hsl(var(--chart-1))" }
    };
    
    const allCropsList = Object.keys(allChartData) as CropName[];

    return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Button asChild variant="ghost" className="mb-4">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4"/> {t('back_to_marketplace')}</Link>
        </Button>
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{t('market_insights')}</h1>
            <p className="text-muted-foreground">{t('market_insights_desc')}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentDate}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1">
                  <CardHeader>
                      <CardTitle>{t('all_crops')}</CardTitle>
                      <CardDescription>{t('select_crop_for_details')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <ScrollArea className="h-96">
                          <div className="space-y-2">
                            {allCropsList.map(crop => (
                                <Button 
                                    key={crop} 
                                    variant={selectedCrop === crop ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                    onClick={() => handleSelectCrop(crop)}
                                >
                                    {t(crop)}
                                </Button>
                            ))}
                          </div>
                      </ScrollArea>
                  </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <CardTitle>{t('price_trend_for', { cropName: t(selectedCrop) })}</CardTitle>
                            <CardDescription>{t('historical_price_data')}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {(['1W', '1M', '6M'] as Timeframe[]).map(tf => (
                                <Button 
                                    key={tf} 
                                    size="sm" 
                                    variant={timeframe === tf ? "default" : "outline"}
                                    onClick={() => setTimeframe(tf)}
                                >
                                    {tf}
                                </Button>
                            ))}
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <LineChart
                                data={chartData}
                                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => `Rs. ${value}`}
                                />
                                <ChartTooltip
                                    cursor={true}
                                    content={<ChartTooltipContent indicator="dot" />}
                                />
                                <Line
                                    dataKey="price"
                                    type="monotone"
                                    stroke={chartConfig.price.color}
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6 }}
                                    name={t(selectedCrop)}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('future_price_prediction')}</CardTitle>
                        <CardDescription>{t('predict_next_month_price_for', { cropName: t(selectedCrop) })}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            onClick={handlePredictPrice}
                            disabled={loadingPrediction}
                            className="w-full"
                        >
                            <Wand2 className="mr-2 h-4 w-4" />
                            {loadingPrediction ? t('predicting') : t('predict_price')}
                        </Button>
                        {prediction && selectedCrop && (
                            <Alert>
                                <Wand2 className="h-4 w-4" />
                                <AlertTitle className="flex items-center gap-2">
                                    {t('prediction_for', { cropName: t(selectedCrop) })}
                                    <Badge>Rs. {prediction.predictedPrice}/kg</Badge>
                                </AlertTitle>
                                <AlertDescription>
                                    {prediction.justification}
                                    <p className="text-xs text-muted-foreground mt-2">{t('prediction_disclaimer')}</p>
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}
