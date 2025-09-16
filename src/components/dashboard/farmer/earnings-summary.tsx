
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function EarningsSummary() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Earnings</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">Rs. 1,250</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">Rs. 8,750</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">Rs. 35,200</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
