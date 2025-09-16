
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export function PriceAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Best Price Alerts</CardTitle>
        <AlertTriangle className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="p-3 bg-secondary rounded-lg">
            <p className="text-sm font-semibold">Onions are 15% cheaper in Nashik today!</p>
            <p className="text-xs text-muted-foreground">Current Price: ₹25/kg</p>
        </div>
         <div className="p-3 bg-secondary rounded-lg">
            <p className="text-sm font-semibold">Tomato prices have dropped in Pune.</p>
            <p className="text-xs text-muted-foreground">Current Price: ₹45/kg</p>
        </div>
      </CardContent>
    </Card>
  );
}
