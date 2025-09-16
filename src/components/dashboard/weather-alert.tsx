import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";
import { Sun, Cloud, CloudRain } from "lucide-react";

export function WeatherAlert() {
  const { t } = useLanguage();
  const weather = {
    city: "Pune",
    temperature: 28,
    condition: "Sunny",
    forecast: "Clear skies expected for the next 48 hours.",
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-6 w-6 text-accent" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-muted-foreground" />;
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      default:
        return <Sun className="h-6 w-6 text-accent" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{t('weather_alert')}</CardTitle>
        {getWeatherIcon(weather.condition)}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{weather.temperature}°C</div>
        <p className="text-sm text-muted-foreground pt-1 font-semibold">
          {t(weather.city)} - {t(weather.condition)}
        </p>
        <p className="text-xs text-muted-foreground pt-2">
          {t(weather.forecast)}
        </p>
      </CardContent>
    </Card>
  );
}
