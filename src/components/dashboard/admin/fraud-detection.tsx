
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const initialAlerts = [
    { id: 'ALERT001', type: 'Unusual Pricing', details: 'Farmer Ramesh K. listed Tomatoes at ₹500/kg, 10x the market average.', severity: 'High' },
    { id: 'ALERT002', type: 'Multiple Logins', details: 'Buyer Anjali S. logged in from multiple locations (Pune, Mumbai) within 10 minutes.', severity: 'Medium' },
    { id: 'ALERT003', type: 'Fake Profile', details: 'A new farmer profile was created with a non-verifiable Aadhaar number.', severity: 'High' },
];

export function FraudDetection() {
    const [alerts, setAlerts] = useState(initialAlerts);
    const { toast } = useToast();

    const handleAction = (alertId: string, action: 'Ignored' | 'Action Taken') => {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
        toast({ title: `Alert Handled: ${action}` });
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Detection Center</CardTitle>
        <CardDescription>Review and take action on suspicious activities.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length > 0 ? alerts.map(alert => (
          <div key={alert.id} className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
                <AlertTriangle className={`h-5 w-5 ${alert.severity === 'High' ? 'text-destructive' : 'text-accent'}`} />
                <div>
                    <h4 className="font-semibold">{alert.type} <span className="text-xs font-normal text-muted-foreground">({alert.severity})</span></h4>
                    <p className="text-sm text-muted-foreground">{alert.details}</p>
                </div>
            </div>
            <div className="flex gap-2 sm:ml-auto">
                <Button variant="outline" size="sm" onClick={() => handleAction(alert.id, 'Ignored')}>Ignore</Button>
                <Button variant="destructive" size="sm" onClick={() => handleAction(alert.id, 'Action Taken')}>Take Action</Button>
            </div>
          </div>
        )) : (
            <div className="text-center text-muted-foreground py-8 flex flex-col items-center justify-center">
                <ShieldCheck className="h-10 w-10 mb-2 text-primary"/>
                <p className="font-semibold">All Clear!</p>
                <p className="text-sm">There are no new fraud alerts.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
