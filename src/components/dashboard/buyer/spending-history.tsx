
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export function SpendingHistory() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Spending</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div>
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">Rs. 4,500</p>
            </div>
             <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">Rs. 18,900</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
