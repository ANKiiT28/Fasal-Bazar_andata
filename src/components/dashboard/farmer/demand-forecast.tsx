
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wheat, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDemandForecast, type DemandForecastOutput } from "@/ai/flows/demand-forecasting";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export function DemandForecast() {
  const [forecast, setForecast] = useState<DemandForecastOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGetForecast = async () => {
    setLoading(true);
    try {
      const result = await getDemandForecast({ crop: "Tomatoes", location: "Pune" });
      setForecast(result);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message && error.message.includes('503') 
        ? "The AI model is currently overloaded. Please try again in a moment."
        : "Could not fetch demand forecast.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">AI Tools</CardTitle>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
         <Button asChild variant="outline" className="w-full">
            <Link href="/crop-doctor">
                <Stethoscope className="mr-2 h-4 w-4" />
                AI Crop Doctor
            </Link>
         </Button>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
            <Wheat className="h-4 w-4" />
            <span>Demand for Tomatoes in Pune</span>
        </div>
        {loading && <p>Loading forecast...</p>}
        {forecast ? (
            <p className="text-lg font-semibold text-primary">{forecast.forecast}</p>
        ): (
             <p className="text-sm text-muted-foreground">Click the button to get the latest demand forecast for your crop.</p>
        )}
        <Button onClick={handleGetForecast} disabled={loading} className="w-full">
            {loading ? "Forecasting..." : "Get Demand Forecast"}
        </Button>
      </CardContent>
    </Card>
  );
}
