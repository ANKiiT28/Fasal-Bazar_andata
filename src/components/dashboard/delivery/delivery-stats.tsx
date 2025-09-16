
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, CheckCircle, Clock } from "lucide-react";

export type Stats = {
    earnings: number;
    deliveriesCompleted: number;
    avgTime: number;
};

interface DeliveryStatsProps {
    stats: Stats;
}

export function DeliveryStats({ stats }: DeliveryStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Stats</CardTitle>
        <CardDescription>Your performance for today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Earnings</p>
            <p className="text-2xl font-bold">Rs. {stats.earnings}</p>
          </div>
          <DollarSign className="h-8 w-8 text-primary" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Deliveries Completed</p>
            <p className="text-2xl font-bold">{stats.deliveriesCompleted}</p>
          </div>
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Avg. Delivery Time</p>
            <p className="text-2xl font-bold">{stats.avgTime} min</p>
          </div>
          <Clock className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
