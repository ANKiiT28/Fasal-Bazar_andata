
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Truck, CheckCircle } from "lucide-react";

export function OrdersDashboard() {
  const orders = {
    pending: 5,
    inTransit: 2,
    completed: 18,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>A summary of your recent orders.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-lg bg-secondary flex flex-col items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{orders.pending}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary flex flex-col items-center justify-center">
            <Truck className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">In-Transit</p>
            <p className="text-2xl font-bold">{orders.inTransit}</p>
        </div>
        <div className="p-4 rounded-lg bg-secondary flex flex-col items-center justify-center">
            <CheckCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{orders.completed}</p>
        </div>
      </CardContent>
    </Card>
  );
}
