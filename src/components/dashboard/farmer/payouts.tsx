
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleDashed } from "lucide-react";

export function Payouts() {
  const transactions = [
    { id: "txn1", amount: 1500, status: "completed" },
    { id: "txn2", amount: 2200, status: "pending" },
    { id: "txn3", amount: 800, status: "completed" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Payouts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {txn.status === "completed" ? (
                <CircleCheck className="h-5 w-5 text-primary" />
              ) : (
                <CircleDashed className="h-5 w-5 text-muted-foreground" />
              )}
              <span className="font-medium">Rs. {txn.amount}</span>
            </div>
            <Badge variant={txn.status === "completed" ? "default" : "secondary"}>
              {txn.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
